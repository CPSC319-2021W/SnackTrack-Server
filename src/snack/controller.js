import { db } from '../db/index.js'

const BAD_REQUEST = '400'
const NOT_AUTHORIZED = '401'
const CONFLICT = 'Validation error'

const Snacks = db.snacks
const SnackBatches = db.snackBatches

export const addSnack = async(req, res) => {
    try {
        const snack = req.body
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
        } else if (err.message === NOT_AUTHORIZED) { // TODO: wait for authentication to be implemented
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
        } else if (err.message === NOT_AUTHORIZED) { // TODO: wait for authentication to be implemented
            return res.status(401).send({ Error: 'Not Authorized' })
        } else {
            return res.status(500).send({ Error: err.message })
        }
    }
}

export const getSnacks = async(req, res) => {
    try {
        const isFetchAll = req.query.active === undefined
        const is_active = req.query.active === 'true'
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

async function addQuantityFromBatch(snack) {
    const desiredBatches = await SnackBatches.findAll({
        where: { snack_id: snack.snack_id }
    })
    const quantity = desiredBatches.reduce((total, batch) => total + batch.quantity, 0)
    return { quantity, ...snack.toJSON() }
}
