var Users = require('./model')

// TODO: edit addUser, add error handling cases
async function addUser(req, res) {
    try {
        console.log('Adding user :', req.body)
        const userID = req.body.UserID
        const userName = req.body.Username

        const user = {
            UserID: userID,
            Username: userName
          }
    
        const result = await Users.create(user)
        console.log('Successfully added : ', result)
        res.sendStatus(201)

    } catch(err) {
        return res.status(400).send({ Error: err })
    }
}
// TODO: implement getUser method
async function getUser(req, res) {
    return res.status(200).send('TODO')
}
module.exports = {
    addUser: addUser,
    getUser: getUser
} 