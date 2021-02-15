import { Admins } from './model.js'

const BAD_REQUEST = "400"
const NOT_AUTHORIZED = "401"
const CONFLICT = "409"

export const addAdmin = async(req, res) => {
    try {
        // TODO : Add logic checking if the requesting user is authorized (Ticket: SNAK-78)
        const admin = req.body
        const result = await Admins.create(admin)
        return res.status(201).send(result)
    } catch (err) {
        if (err.message === BAD_REQUEST) {
            return res.status(400).send({ Error: "Bad Request" })
        } else if (err.message === NOT_AUTHORIZED) {
            return res.status(401).send({ Error: "Not Authorized" })
        } else if (err.message === CONFLICT) {
            return res.status(409).send({ Error: "Conflict" })
        } else {
            return res.status(500).send({ Error: "Internal Server Error" })
        }
    }
}