import { db } from '../../../src/db/index.js'
import { getUserTransactions } from '../../../src/transaction/controller.js'
import * as pagination from '../../../src/util/pagination.js'

const Users = db.users

describe ('GET /:user_id/transactions', () => {
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
        'transactions': [
          {
            'transaction_id': 1,
            'snack_name': 'Lays - Original',
            'transaction_amount': 100,
            'quantity': 1,
            'transaction_dtm': '2021-03-31T21:36:26.006Z',
            'user_id': 1,
            'payment_id': null,
            'transaction_type_id': 1
          },
          {
            'transaction_id': 2,
            'snack_name': 'KitKat',
            'transaction_amount': 100,
            'quantity': 1,
            'transaction_dtm': '2021-03-30T21:36:26.006Z',
            'user_id': 1,
            'payment_id': null,
            'transaction_type_id': 1
          }
        ],
        'total_pages': 1,
        'current_page': 0
      })
    })
  })

  afterAll (async () => jest.clearAllMocks())

  it ('should reject with 404 - user_id not found', async () => {
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
    const expected = { error: 'user_id does not exist in the users table' }
    await getUserTransactions(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should get user transactions', async () => {
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
      'transactions': [
        {
          'transaction_id': 1,
          'snack_name': 'Lays - Original',
          'transaction_amount': 100,
          'quantity': 1,
          'transaction_dtm': '2021-03-31T21:36:26.006Z',
          'user_id': 1,
          'payment_id': null,
          'transaction_type_id': 1
        },
        {
          'transaction_id': 2,
          'snack_name': 'KitKat',
          'transaction_amount': 100,
          'quantity': 1,
          'transaction_dtm': '2021-03-30T21:36:26.006Z',
          'user_id': 1,
          'payment_id': null,
          'transaction_type_id': 1
        }
      ],
      'total_pages': 1,
      'current_page': 0
    }
    await getUserTransactions(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})
