import { Snacks } from './model.js'

const BAD_REQUEST = "400"
const NOT_AUTHORIZED = "401"
const NOT_FOUND = "404"
const CONFLICT = "409"

export const getSnacks = async(req, res) => {
    try {
        const snacks =  await Snacks.findAll()
        const response = JSON.stringify(snacks)
        return res.status(200).send(response)
    } catch (err) {
        if (err.message === NOT_FOUND) {
            return res.status(404).send({ Error: "Not Found" })
        } else {
            return res.status(400).send({ Error: err.message })
        }
    }
}
