import { db } from '../db/index.js'

const ERROR_CODES = {
  400: 'Bad Request',
  401: 'Not Authorized',
  404: 'Not Found',
  409: 'Conflict'
}

const Suggestions = db.suggestions
const Users = db.users

export const addSuggestion = async (req, res) => {
  try {
    const suggestion = req.body
    const userId = suggestion.suggested_by
    const user = await Users.findByPk(userId)
    if (!user) throw new Error(404)

    const suggestionText = suggestion.suggestion_text
    if (typeof suggestionText !== 'string' || suggestionText.length == 0) throw new Error(400)    // Change the condition depending on frontend validation check

    const result = await Suggestions.create(suggestion)
    return res.status(201).send(result)
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

export const getSuggestions = async (req, res) => {
  try {
    const response = await Suggestions.findAll()
    res.status(200).send({ [Suggestions.name]: response })
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
