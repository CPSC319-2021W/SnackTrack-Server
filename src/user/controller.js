import { Users } from './model.js'

// Reference: PostgreSQL error code documentation
// https://www.postgresql.org/docs/8.2/errcodes-appendix.html
// 23505 = UNIQUE_VIOLATION
const UNIQUE_VIOLATION = "23505" 

const NOT_FOUND = "404"

export const addUser = async(req, res) => {
    try {
        const user = req.body
        // TODO: Auto-populate from GAuth (Ticket: SNAK-72)
        user.first_name = "Fname"
        user.last_name = "Lname"

        const result = await Users.create(user)
        res.status(201).send(result)
    } catch (err) {
        if(err.parent.code === UNIQUE_VIOLATION) {
            return res.status(409).send({ Error: err.message })
        }
        return res.status(400).send({ Error: err.message })
    }
}

// TODO: implement getUser method
export const getUser = async(req, res) => {
    return res.status(200).send('TODO')
}