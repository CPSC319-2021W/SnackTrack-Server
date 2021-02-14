import { Admins } from './model.js'

export const addAdmin = async(req, res) => {
    try {
        // TODO : Add logic checking if the requesting user is authorized (Ticket: SNAK-78)
        const admin = req.body
        const result = await Admins.create(admin)
        return res.status(201).send(result)
    } catch (err) {
        return res.status(400).send({ Error: err.message })
    }
}