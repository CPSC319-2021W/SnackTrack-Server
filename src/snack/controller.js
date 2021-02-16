import Snacks from './model.js'

// TODO: Create snack_batches record (SNAK-110)
export const getSnacks = async(req, res) => {
    try {
        const snacks =  await Snacks.findAll()
        const snackList = JSON.stringify(snacks)
        const response = {'snacks': snackList}

        return res.status(200).send(response)
    } catch (err) {
            return res.status(400).send({ Error: err.message })
    }
}
