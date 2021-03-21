import { db } from '../db/index.js'
import { errorCode } from '../util/error.js'

const Snacks = db.snacks
const SnackBatches = db.snackBatches
const instance = db.dbInstance

export const addSnack = async(req, res) => {
  try {
    const result = await instance.transaction(async (t) => {
      const snack = req.body
      if (snack.quantity < 0) {
        return res.status(400).json({ error: 'quantity must be greater than 0!' })
      }
      let quantity = 0
      const result = await Snacks.create(snack, { transaction: t })
      if (snack.quantity > 0) {
        quantity = snack.quantity
        const snackBatch = {
          snack_id: result.snack_id,
          quantity,
          expiration_dtm: snack.expiration_dtm
        }
        await SnackBatches.create(snackBatch, { transaction: t })
      }
      return { quantity, ...result.toJSON() }
    })
    return res.status(201).json(result)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const addSnackBatches = async(req, res) => {
  try {
    const snackBatch = req.body
    const result = await SnackBatches.create(snackBatch)
    return res.status(201).json(result)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const putSnacks = async(req, res) => {
  try {
    const snack = req.body
    const snack_id = req.params.snack_id
    if (Object.keys(snack).length === 0) {
      return res.status(200).json(await Snacks.findByPk(snack_id))
    }
    if (snack.order_threshold === 'null') {
      snack.order_threshold = null
    }
    const [found, result] = await Snacks.update(snack, { where: { snack_id }, returning: true })
    const [data] = result.map(elem => elem.get())
    if (!found) {
      return res.status(404).json({ error: 'snack_id is not found on the snack table.' })
    }
    return res.status(200).json(data)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const putSnackBatches = async(req, res) => {
  try {
    const snackBatch = req.body
    const snack_batch_id = req.params.snack_batch_id
    if (Object.keys(snackBatch).length === 0) {
      return res.status(200).json(await SnackBatches.findByPk(snack_batch_id))
    }
    if (snackBatch.snack_id !== undefined) {
      return res.status(400).json({ error: 'snack_id cannot be changed for snack_batches.' })
    }
    if (snackBatch.snack_batch_id !== undefined) {
      return res.status(400).json({ error: 'snack_batch_id cannot be changed for snack_batches' })
    }
    if (snackBatch.expiration_dtm === 'null') {
      snackBatch.expiration_dtm = null
    }
    const [found, result] = await SnackBatches.update(snackBatch, { where: { snack_batch_id }, returning: true })
    const [data] = result.map(elem => elem.get())
    if (!found) {
      return res.status(404).json({ error: 'snack_batch_id is not found on the snack_batch table' })
    }
    return res.status(200).json(data)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const getSnacks = async(req, res) => {
  try {
    const isFetchAll = req.query.active === undefined
    const is_active = req.query.active !== 'false'
    const where = isFetchAll ? {} : { is_active }
    const data = await Snacks.findAll({
      where, order: [['snack_type_id', 'ASC']]
    })
    const snacks = await Promise.all(data.map(snack => addQuantityFromBatch(snack)))
    return res.status(200).json({ snacks })
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const getSnackBatches = async(req, res) => {
  try {
    const isFetchAll = req.query.snack_id === undefined
    const snack_id = req.query.snack_id
    const where = isFetchAll ? {} : { snack_id }
    const snack_batches = await SnackBatches.findAll({
      where, order: [['snack_batch_id', 'ASC']]
    })
    return res.status(200).json({ snack_batches })
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const deleteSnacks = async(req, res) => {
  try {
    const snack_id = req.params.snack_id
    const rows = await Snacks.destroy({ where: { snack_id } })
    if (!rows) {
      return res.status(404).json({ error: 'snack_id is not found on the snack table.' })
    }
    return res.status(204).json()
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const deleteSnackBatches = async(req, res) => {
  try {
    const snack_batch_id = req.params.snack_batch_id
    const rows = await SnackBatches.destroy({ where: { snack_batch_id } })
    if (!rows) {
      return res.status(404).json({ error: 'snack_batch_id is not found on the snack batch table.' })
    }
    return res.status(204).json()
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

async function addQuantityFromBatch(snack) {
  const desiredBatches = await SnackBatches.findAll({
    where: { snack_id: snack.snack_id }
  })
  const quantity = desiredBatches.reduce((total, batch) => total + batch.quantity, 0)
  return { quantity, ...snack.toJSON() }
}

export const decreaseQuantityInSnackBatches = async (quantity, snack_id, transaction) => {
  const snackBatches = await SnackBatches.findAll({
    where: { snack_id },
    order: [['expiration_dtm', 'DESC'], ['snack_batch_id', 'DESC']]
  })
  let requestedQuantity = quantity
  const totalQuantity = snackBatches.reduce((prev, cur) => {
    return prev + cur.quantity
  }, 0)
  if (requestedQuantity > totalQuantity) {
    throw Error('requested quantity exceeds the total stock.')
  }
  const tasks = []
  while (requestedQuantity > 0) { 
    const currBatch = snackBatches.pop()
    if (requestedQuantity >= currBatch.quantity) {
      requestedQuantity -= currBatch.quantity
      tasks.push(currBatch.destroy({ transaction }))
    } else {
      const quantity = currBatch.quantity - requestedQuantity
      requestedQuantity = 0
      tasks.push(currBatch.update({ quantity }, { transaction }))
    }
  }
  await Promise.all(tasks)
}

export const increaseQuantityInSnackBatch = async (quantity, snack_id, transaction) => {
  const snackBatch = await SnackBatches.findOne({
    where: { snack_id },
    order: [['expiration_dtm', 'ASC'], ['snack_batch_id', 'ASC']]
  })
  if (snackBatch) {
    await snackBatch.increment({ quantity }, { transaction })
  } else {
    await SnackBatches.create({ snack_id, quantity, expiration_dtm: null }, { transaction })
  }
}
