import { db } from '../db/index.js'
import sequelize from 'sequelize'
const { Op } = sequelize

const UNIQUE_VIOLATION = '23505'
const Snacks = db.snacks
const SnackBatches = db.snackBatches

export const addSnack = async(req, res) => {
  try {
    const snack = req.body
    if (snack.quantity < 0) {
      return res.status(400).json({ Error: 'Bad Request: quantity must be greater than 0!' })
    }
    const result = await Snacks.create(snack)
    let quantity = 0
    if (snack.quantity > 0) {
      quantity = snack.quantity
      const snackBatch = {
        snack_id: result.snack_id,
        quantity,
        expiration_dtm: snack.expiration_dtm
      }
      await SnackBatches.create(snackBatch)
    }
    return res.status(201).json({ quantity, ...result.toJSON() })
  } catch (err) {
    if (err.parent.code === UNIQUE_VIOLATION) {
      return res.status(409).json({ error: 'User is already exist.' })
    }
    return res.status(500).json({ error: err.message })
  }
}

export const addSnackBatches = async(req, res) => {
  try {
    const snackBatch = req.body
    const result = await SnackBatches.create(snackBatch)
    return res.status(201).json(result)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const putSnacks = async(req, res) => {
  try {
    const snack = req.body
    const snack_id = req.params.snack_id
    const result = await Snacks.update(snack, { where: { snack_id } })
    if (result[0] === 0) {
      return res.status(404).json({ Error: 'snack_id is not found on the snack table.' })
    }
    return res.status(204).json()
  } catch (err) {
    return res.status(500).json({ error: err.message })
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
    return res.status(500).json({ error: err.message })
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
    return res.status(500).json({ error: err.message })
  }
}

export const deleteSnacks = async(req, res) => {
  try {
    const snack_id = req.params.snack_id
    const rows = await Snacks.destroy({ where: { snack_id } })
    if (!rows) {
      return res.status(404).json({ Error: 'snack_id is not found on the snack table.' })
    }
    return res.status(204).json()
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

async function addQuantityFromBatch(snack) {
  const desiredBatches = await SnackBatches.findAll({
    where: { snack_id: snack.snack_id }
  })
  const quantity = desiredBatches.reduce((total, batch) => total + batch.quantity, 0)
  return { quantity, ...snack.toJSON() }
}

export const updateSnackBatches = async (quantity, snackId) => {
  const snackBatches = await SnackBatches.findAll({
    where: {
      snack_id: snackId,
      expiration_dtm: {
        [Op.or]: {
          [Op.gt]: new Date(),
          [Op.eq]: null
        }
      }
    },
    order: [['expiration_dtm', 'DESC']]
  })
    
  let requestedQuantity = quantity
  const totalQuantity = snackBatches.reduce((prev, cur) => {
    return prev + cur.quantity
  }, 0)
  if (requestedQuantity > totalQuantity) {
    throw Error('Bad Request: Requested quantity exceeds the total stock.')
  }
  const tasks = []
  while (requestedQuantity > 0) { 
    const currBatch = snackBatches.pop()
    if (requestedQuantity >= currBatch.quantity) {
      requestedQuantity -= currBatch.quantity
      tasks.push(currBatch.destroy())
    } else {
      const quantity = currBatch.quantity - requestedQuantity
      requestedQuantity = 0
      tasks.push(currBatch.update({ quantity }))
    }
  }
  await Promise.all(tasks)
}
