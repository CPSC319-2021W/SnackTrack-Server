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
        let returnVal
        if (snack.quantity > 0) {
            returnVal = addPropertyQuantity(result, snack.quantity)
            const snackBatch = {
                snack_id: result.snack_id,
                quantity: snack.quantity,
                expiration_dtm: snack.expiration_dtm
            }
            await SnackBatches.create(snackBatch)
        } else {
            returnVal = addPropertyQuantity(result, 0)
        }

        return res.status(201).send(returnVal)
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

function addPropertyQuantity (sequelizeInstance, quantity) {
    const returnVal = sequelizeInstance.toJSON()
    returnVal.quantity = quantity
    return returnVal
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
        let { active } = req.query
        let is_active = parseQueryParams(active)

        const snacks =  await Snacks.findAll({
            where: { is_active : is_active }
        })
        const response = {'snacks': snacks}
        
        return res.status(200).send(response)
    } catch (err) {
            return res.status(400).send({ Error: err.message })
    }
}

function parseQueryParams(active) {
    if( active === undefined || active != 'false') {
        return true
    }
    return false 
}
