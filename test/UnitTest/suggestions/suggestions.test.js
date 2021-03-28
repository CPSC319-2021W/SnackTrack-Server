import { db } from '../../../src/db/index.js'
import { deleteSuggestions, getSuggestions } from '../../../src/suggestion/controller.js'

const Suggestions = db.suggestions

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

describe ('DELETE /suggestions', () => {
  beforeAll (async () => {
    jest.spyOn(Suggestions, 'destroy').mockImplementation(() => {
      return Promise.resolve()
    })
  })

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
