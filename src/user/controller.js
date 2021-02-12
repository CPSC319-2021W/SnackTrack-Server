import { Users } from './model.js'

// TODO: edit addUser, add error handling cases
export const addUser = async(req, res) => {
    try {
        console.log('Adding user :', req.body)
        const user = req.body
    
        const result = await Users.create(user)
        console.log('Successfully added : ', result)
        res.sendStatus(201)

    } catch(err) {
        return res.status(400).send({ Error: err.message })
    }
}

// TODO: implement getUser method
export const getUser = async(req, res) => {
    return res.status(200).send('TODO')
}