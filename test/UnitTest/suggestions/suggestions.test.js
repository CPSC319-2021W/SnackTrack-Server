import { db } from '../../../src/db/index.js'
import { addSuggestion, deleteSuggestions, getSuggestions } from '../../../src/suggestion/controller.js'

const Suggestions = db.suggestions
const Users = db.users

describe ('GET /suggestions', () => {
  beforeAll (async () => {
    jest.spyOn(Suggestions, 'findAll').mockImplementation(() => {
      return Promise.resolve([
        {
          'suggestion_id': 1,
          'suggested_by': 1, 
          'suggestion_text': 'pocky',
          'suggestion_dtm': '2012-03-19T07:22Z'
        },
        {
          'suggestion_id': 2,
          'suggested_by': 2,
          'suggestion_text': 'cup noodles',
          'suggestion_dtm': '2012-04-19T07:22Z'
        }
      ])
    })
  })

  afterAll (() => jest.clearAllMocks())

  it ('should get suggestions', async () => {
    const mockRequest = () => {
      return {}
    }
    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }
    const req = mockRequest()
    const res = mockResponse()
    const expected = {
      suggestions: [
        {
          'suggestion_id': 1,
          'suggested_by': 1, 
          'suggestion_text': 'pocky',
          'suggestion_dtm': '2012-03-19T07:22Z'
        },
        {
          'suggestion_id': 2,
          'suggested_by': 2,
          'suggestion_text': 'cup noodles',
          'suggestion_dtm': '2012-04-19T07:22Z'
        }
      ]
    }
    await getSuggestions(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe ('POST /suggestions', () => {
  beforeEach (async () => {
    jest.spyOn(Users, 'findByPk').mockImplementation((user_id) => {
      if (user_id === 1) {
        return Promise.resolve({
          'user_id': user_id
        })
      } else {
        return Promise.resolve(null)
      }
    })
    jest.spyOn(Suggestions, 'create').mockImplementation((suggestion) => {
      return Promise.resolve({
        'suggestion_id': 1,
        'suggested_by': suggestion.suggested_by,
        'suggestion_text': suggestion.suggestion_text,
        'suggestion_dtm': '2012-03-19T07:22Z'
      })
    })
  })

  afterEach (async () => {
    jest.restoreAllMocks()
  })

  it ('should create a new suggestion', async () => {
    const mockRequest = () => {
      const req = {
        'body': {
          'suggested_by': 1,
          'suggestion_text': 'pocky'
        }
      }
      return req
    }
    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }
    const req = mockRequest()
    const res = mockResponse()
    const expected = {
      'suggestion_id': 1,
      'suggested_by': 1,
      'suggestion_text': 'pocky',
      'suggestion_dtm': '2012-03-19T07:22Z'
    }
    await addSuggestion(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should reject with 404 - user_id not found', async () => {
    const mockRequest = () => {
      const req = {
        'body': {
          'suggested_by': 999,
          'suggestion_text': 'pocky'
        }
      }
      return req
    }
    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }
    const req = mockRequest()
    const res = mockResponse()
    const expected = { error: 'userid does not exist in the users table.' }
    await addSuggestion(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should reject with 400 - suggestion text is invalid', async () => {
    const mockRequest = () => {
      const req = {
        'body': {
          'suggested_by': 1,
          'suggestion_text': ''
        }
      }
      return req
    }
    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }
    const req = mockRequest()
    const res = mockResponse()
    const expected = { error: 'suggestionText is empty.' }
    await addSuggestion(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should reject with 400 - suggestion text is invalid', async () => {
    const mockRequest = () => {
      const req = {
        'body': {
          'suggested_by': 1,
          'suggestion_text': '     '
        }
      }
      return req
    }
    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }
    const req = mockRequest()
    const res = mockResponse()
    const expected = { error: 'suggestionText is empty.' }
    await addSuggestion(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe ('DELETE /suggestions', () => {
  beforeAll (async () => {
    jest.spyOn(Suggestions, 'destroy').mockImplementation(() => {
      return Promise.resolve()
    })
  })

  afterAll (() => jest.clearAllMocks())

  it ('should delete suggestions', async () => {
    const mockRequest = () => {
      return {}
    }
    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }
    const req = mockRequest()
    const res = mockResponse()
    await deleteSuggestions(req, res)
    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.json).toHaveBeenCalledWith()
  })
})
