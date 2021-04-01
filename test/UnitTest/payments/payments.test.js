import { db } from '../../../src/db/index.js'
import { addPayment, getUserPayments } from '../../../src/payment/controller.js'
import * as pagination from '../../../src/util/pagination.js'

const Users = db.users
const instance = db.dbInstance

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
    const expected = { error: 'userid does not exist in the users table.' }
    await getUserPayments(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe ('POST /payments', () => {
  let req, res
  beforeAll (async () => {
    const user1 = {
      'user_id': 1,
      'is_admin': true,
      'username': 'testone',
      'balance': 1000
    }
    jest.spyOn(instance, 'transaction').mockImplementation(() => {
      const payment = req.body
      const user_id = payment.user_id
      const { user_id: currUserId, is_admin } = req.user
      if (!is_admin && parseInt(user_id) !== currUserId) {
        return res.status(403).json({ error: 'Not authorized.' })
      }
      if (user_id !== 1) {
        return res.status(404).json({ error: 'user_id does not exist in the users table.' })
      }
      const updatedBalance = user1.balance - payment.payment_amount
      if (updatedBalance < 0) {
        return res.status(400).json({ error: 'Unable to carry a balance less than 0.' })
      }
      const result = {
        'payment_id': 1,
        'payment_amount': payment.payment_amount,
        'payment_dtm': '2012-03-19T07:22Z',
        'created_by': payment.created_by,
        'user_id': payment.user_id
      }
      return result
    })
  })

  afterAll (async () => jest.clearAllMocks())

  it ('should reject with 403 - not authorized', async () => {
    const mockRequest = () => {
      const req = {
        'user': {
          'user_id': 1,
          'is_admin': false
        },
        'body': {
          'user_id': 2,
          'created_by': 'test1',
          'payment_amount': 400,
          'transaction_ids': [122, 133, 150]
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
    req = mockRequest()
    res = mockResponse()
    const expected = { error: 'Not authorized.' }
    await addPayment(req, res)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should reject with 404 - user_id not found', async () => {
    const mockRequest = () => {
      const req = {
        'user': {
          'user_id': 999,
          'is_admin': false
        },
        'body': {
          'user_id': 999,
          'created_by': 'test1',
          'payment_amount': 400,
          'transaction_ids': [122, 133, 150]
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
    req = mockRequest()
    res = mockResponse()
    const expected = { error: 'user_id does not exist in the users table.' }
    await addPayment(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should reject with 400 - balance < payment_amount', async () => {
    const mockRequest = () => {
      const req = {
        'user': {
          'user_id': 1,
          'is_admin': true
        },
        'body': {
          'user_id': 1,
          'created_by': 'test1',
          'payment_amount': 4000,
          'transaction_ids': [122, 133, 150]
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
    req = mockRequest()
    res = mockResponse()
    const expected = { error: 'Unable to carry a balance less than 0.' }
    await addPayment(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should create a new payment', async () => {
    const mockRequest = () => {
      const req = {
        'user': {
          'user_id': 1,
          'is_admin': true
        },
        'body': {
          'user_id': 1,
          'created_by': 'test1',
          'payment_amount': 1000,
          'transaction_ids': [122, 133, 150]
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
    req = mockRequest()
    res = mockResponse()
    const expected = {
      'payment_id': 1,
      'payment_amount': 1000,
      'payment_dtm': '2012-03-19T07:22Z',
      'created_by': 'test1',
      'user_id': 1
    }
    await addPayment(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})
