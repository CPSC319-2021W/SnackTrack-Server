import { db } from '../../../src/db/index.js'
import { getUserPayments } from '../../../src/payment/controller.js'
import * as pagination from '../../../src/util/pagination.js'

const Users = db.users

describe ('GET /:user_id/payments', () => {
  beforeAll (async () => {
    jest.spyOn(Users, 'findByPk').mockImplementation((user_id) => {
      if (user_id === 1) {
        return Promise.resolve({ 'user_id': user_id })
      } else {
        return Promise.resolve(null)
      }
    })
    jest.spyOn(pagination, 'getPaginatedData').mockImplementation(() => {
      return Promise.resolve({
        'total_rows': 1,
        'payments': [
          {
            'payment_id': 1,
            'payment_amount': 200,
            'payment_dtm': '2012-03-19T07:22Z',
            'created_by': 'test',
            'user_id': 1,
          },
          {
            'payment_id': 2,
            'payment_amount': 400,
            'payment_dtm': '2012-03-11T07:22Z',
            'created_by': 'test',
            'user_id': 1,
          }
        ],
        'total_pages': 1,
        'current_page': 0
      })
    })
  })

  afterAll (async () => jest.clearAllMocks())

  it ('should get user payments', async () => {
    const mockRequest = () => {
      return { 'params' : { 'user_id': 1 } }
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
      'total_rows': 1,
      'payments': [
        {
          'payment_id': 1,
          'payment_amount': 200,
          'payment_dtm': '2012-03-19T07:22Z',
          'created_by': 'test',
          'user_id': 1,
        },
        {
          'payment_id': 2,
          'payment_amount': 400,
          'payment_dtm': '2012-03-11T07:22Z',
          'created_by': 'test',
          'user_id': 1,
        }
      ],
      'total_pages': 1,
      'current_page': 0
    }
    await getUserPayments(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should get user payments', async () => {
    const mockRequest = () => {
      return { 'params' : { 'user_id': 999 } }
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
    await getUserPayments(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})
