import { db } from '../db/index.js'
import { errorCode } from '../util/error.js'

const Suggestions = db.suggestions
const Users = db.users

export const addSuggestion = async (req, res) => {
  try {
    const suggestion = req.body
    const userId = suggestion.suggested_by
    const user = await Users.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'userid does not exist in the users table.' })
    }
    const suggestionText = suggestion.suggestion_text
    if (!suggestionText || !suggestionText.trim()) {
      return res.status(400).json({ error: 'suggestionText is empty.' })
    }
    const result = await Suggestions.create(suggestion)
    return res.status(201).json(result)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const getSuggestions = async (_, res) => {
  try {
    const response = await Suggestions.findAll()
    return res.status(200).json({ suggestions: response })
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const deleteSuggestions = async(_, res) => {
  try {
    await Suggestions.destroy({ where: { }, force: true })
    return res.status(204).json()
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}
