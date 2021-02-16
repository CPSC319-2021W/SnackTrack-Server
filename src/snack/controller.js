import Snacks from './model.js'

export const getSnacks = async(req, res) => {
    try {
        const snacks =  await Snacks.findAll()
        const response = JSON.stringify(snacks)

        return res.status(200).send(response)
    } catch (err) {
            return res.status(400).send({ Error: err.message })
    }
}
