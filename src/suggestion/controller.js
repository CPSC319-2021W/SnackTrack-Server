import { db } from '../db/index.js'

const ERROR_CODES = {
    401: 'Not Authorized'
}

const Suggestions = db.suggestions

export const getSuggestions = async (req, res) => {
    try {
        const response = await Suggestions.findAll()
        res.status(200).send({ 'suggestions': response })
    } catch (err) {
        // TODO: Handling 401 NOT AUTHORIZED SNAK-123
        // TODO: Handleing a custom error SNAK-237
        const code = Number(err.message)
        if (code in ERROR_CODES) {
            return res.status(code).send({ Error: ERROR_CODES[code] })
        } else {
            return res.status(500).send({ Error: 'Internal Server Error' })
        }
    }
}
