import { Users } from './model.js'

var notUniqueErrorCode = "23505" 

export const addUser = async(req, res) => {
    try {
        const user = req.body
        const result = await Users.create(user)
        res.status(201).send(result)
    } catch(err) {
        if(err.parent.code = notUniqueErrorCode) {
            return res.status(409).send({ Error: err.message })
        }
        return res.status(400).send({ Error: err.message })
    }
}

// TODO: implement getUser method
export const getUser = async(req, res) => {
    return res.status(200).send('TODO')
}