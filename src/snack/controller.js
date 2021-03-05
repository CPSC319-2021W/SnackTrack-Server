import { db } from '../db/index.js'
import sequelize from 'sequelize'
const { Op } = sequelize

const BAD_REQUEST = '400'
const NOT_AUTHORIZED = '401'
const NOT_FOUND = '404'
const CONFLICT = 'Validation error'

const Snacks = db.snacks
const SnackBatches = db.snackBatches

export const addSnack = async(req, res) => {
    try {
        const snack = req.body
        if (snack.quantity < 0) throw Error(400)
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
        return res.status(201).send({ quantity, ...result.toJSON() })
    } catch (err) {
        if (err.message === BAD_REQUEST) {
            return res.status(400).send({ Error: 'Bad Request' })
        } else if (err.message === NOT_AUTHORIZED) {
            return res.status(401).send({ Error: 'Not Authorized' })
        } else if (err.message === CONFLICT) {
            return res.status(409).send({ Error: 'This snack already exists.' })
        } else {
            return res.status(500).send({ Error: err.message })
        }
    }
}

export const addSnackBatches = async(req, res) => {
    try {
        const snackBatch = req.body
        const result = await SnackBatches.create(snackBatch)
        return res.status(201).send(result)
    } catch (err) {
        if (err.message === BAD_REQUEST) {
            return res.status(400).send({ Error: 'Bad Request' })
        } else if (err.message === NOT_AUTHORIZED) {
            return res.status(401).send({ Error: 'Not Authorized' })
        } else {
            return res.status(500).send({ Error: err.message })
        }
    }
}

export const putSnacks = async(req, res) => {
    try {
        const snackID = req.params.snack_id
        const snackInstance = await Snacks.findByPk(snackID)
        if (snackInstance === null) throw new Error(404)

        await snackInstance.update(req.body)

        return res.status(200).send(snackInstance)
    } catch (err) {
        if (err.message === BAD_REQUEST) {
            return res.status(400).send({ Error: 'Bad Request' })
        } else if (err.message === NOT_AUTHORIZED) {
            return res.status(401).send({ Error: 'Not Authorized' })
        } else if (err.message === NOT_FOUND) {
            return res.status(404).send({ ERROR: 'Not Found' })
        } else {
            return res.status(500).send({ Error: err.message })
        }
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
        return res.status(200).send({ snacks })
    } catch (err) {
        return res.status(400).send({ Error: err.message })
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
        return res.status(200).send({ snack_batches })
    } catch (err) {
        return res.status(400).send({ Error: err.message })
    }
}

export const deleteSnacks = async(req, res) => {
    try {
        const snack_id = req.params.snack_id

        const rows = await Snacks.destroy({ where: { snack_id } })
        if (!rows) throw new Error(404)

        return res.status(204).send()
    } catch (err) {
        if (err.message === NOT_AUTHORIZED) {
            return res.status(401).send({ Error: 'Not Authorized' })
        } else if (err.message === NOT_FOUND) {
            return res.status(404).send({ Error: 'Not Found' })
        } else {
            return res.status(500).send({ Error: err.message })
        }
    }
}

async function addQuantityFromBatch(snack) {
    const desiredBatches = await SnackBatches.findAll({
        where: { snack_id: snack.snack_id }
    })
    const quantity = desiredBatches.reduce((total, batch) => total + batch.quantity, 0)
    return { quantity, ...snack.toJSON() }
}

export const updateSnackBatches = async (transaction, snackId) => {
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
    
    let requestedQuantity = transaction.quantity
    const totalQuantity = snackBatches.reduce((prev, cur) => {
      return prev + cur.quantity
    }, 0)
  
    if (requestedQuantity > totalQuantity) {
      let err = Error(400)
      err.name = 'Requested quantity exceeds the total stock'
      throw err
    }
    
    while (requestedQuantity > 0) { 
      const currBatch = snackBatches.pop()
      if (requestedQuantity >= currBatch.quantity) {
        requestedQuantity -= currBatch.quantity
        await currBatch.destroy()
      } else {
        const quantity = currBatch.quantity - requestedQuantity
        requestedQuantity = 0
        await currBatch.update({ quantity })
      }
    }
  }
