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

async function findQuantity(snackInstance) {
    const instanceJson = snackInstance.toJSON()
    let desiredBatches = await findSnackBatchesWithSnackId(instanceJson.snack_id)
    let quantity = 0

    if (desiredBatches.length !== 0) {
        for (let index in desiredBatches) {
            quantity += desiredBatches[index].toJSON().quantity
        }
    }
    return quantity
}

function addPropertyQuantity(snackInstance, quantity) {
    const returnVal = snackInstance.toJSON()
    returnVal.quantity = quantity
    return returnVal
}

function findSnackBatchesWithSnackId(snackID) {
    return SnackBatches.findAll({
        where: {
            snack_id: snackID
        }
    })
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
        let snacks
        const { active } = req.query
        console.log(active)

        if (active === undefined) {
            snacks = await Snacks.findAll()
        } else {
            const isActive = active !== 'false'
            snacks = await Snacks.findAll({
                where: {
                    is_active: isActive
                }
            })
        }
        let responseArray = []
        for (let index in snacks) {
            let quantity = await findQuantity(snacks[index])
            responseArray[index] = addPropertyQuantity(snacks[index], quantity)
        }

        const response = {'snacks': responseArray}

        return res.status(200).send(response)
    } catch (err) {
            return res.status(400).send({ Error: err.message })
    }
}
