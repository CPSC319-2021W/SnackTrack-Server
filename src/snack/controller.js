import Snacks from './model.js'

// TODO: Implement snack_batches for GET /snacks (SNAK-121)
export const getSnacks = async(req, res) => {
    try {
        const snacks =  await Snacks.findAll()
        const response = {'snacks': snacks}

        return res.status(200).send(response)
    } catch (err) {
            return res.status(400).send({ Error: err.message })
    }
}
