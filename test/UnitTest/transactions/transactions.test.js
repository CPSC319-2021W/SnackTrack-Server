import { db } from '../../../src/db/index.js'
import { addTransaction, getPendingOrders, getPopularSnacks, getUserTransaction, getUserTransactions } from '../../../src/transaction/controller.js'
import * as pagination from '../../../src/util/pagination.js'
import { popularSnacks } from './popularSnacks.data.js'

const Users = db.users
const Transactions = db.transactions
const instance = db.dbInstance

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

describe ('GET /:user_id/transactions/:transaction_id', () => {
  beforeAll (async () => {
    jest.spyOn(Transactions, 'findOne').mockImplementation((condition) => {
      if (condition.where.transaction_id === 1) {
        return Promise.resolve({
          'transaction_id': 1,
          'snack_name': 'KitKat',
          'transaction_amount': 125,
          'quantity': 1,
          'transaction_dtm': '2021-03-20T21:50:18.299Z',
          'user_id': 1,
          'payment_id': null,
          'transaction_type_id': 1
        })
      } else {
        return Promise.resolve(null)
      }
    })
  })

  afterAll (async () => jest.clearAllMocks())

  it ('should reject with 404 - transaction_id not found', async () => {
    const mockRequest = () => {
      return { 'params' : { 'user_id': 1, 'transaction_id': 999 } }
    }
    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }
    const req = mockRequest()
    const res = mockResponse()
    const expected = { error: 'transaction does not exist in the table' }
    await getUserTransaction(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should get a transaction of the user', async () => {
    const mockRequest = () => {
      return { 'params' : { 'user_id': 1, 'transaction_id': 1 } }
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
      'transaction_id': 1,
      'snack_name': 'KitKat',
      'transaction_amount': 125,
      'quantity': 1,
      'transaction_dtm': '2021-03-20T21:50:18.299Z',
      'user_id': 1,
      'payment_id': null,
      'transaction_type_id': 1
    }
    await getUserTransaction(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe ('GET /users/:user_id/pendingOrders', () => {
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
            'transaction_type_id': 3
          },
          {
            'transaction_id': 2,
            'snack_name': 'KitKat',
            'transaction_amount': 100,
            'quantity': 1,
            'transaction_dtm': '2021-03-30T21:36:26.006Z',
            'user_id': 1,
            'payment_id': null,
            'transaction_type_id': 3
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
    await getPendingOrders(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should get user pendingOrders', async () => {
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
          'transaction_type_id': 3
        },
        {
          'transaction_id': 2,
          'snack_name': 'KitKat',
          'transaction_amount': 100,
          'quantity': 1,
          'transaction_dtm': '2021-03-30T21:36:26.006Z',
          'user_id': 1,
          'payment_id': null,
          'transaction_type_id': 3
        }
      ],
      'total_pages': 1,
      'current_page': 0
    }
    await getPendingOrders(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe ('GET /transactions (GET popularSnacks)', () => {
  const convertToMapArray = (snacks) => {
    const result = []
    for (const snack of snacks) {
      const m = new Map()
      m.set('snack_name', snack.snack_name)
      m.set('total_quantity', snack.total_quantity)
      result.push(m)
    }
    return result
  }

  beforeAll (async () => {
    jest.spyOn(Transactions, 'findAll').mockImplementation(() => {
      const result = convertToMapArray(popularSnacks)
      return Promise.resolve(result)
    })
  })

  afterAll (async () => jest.clearAllMocks())

  it ('should reject with 400 - start_date is null', async () => {
    const mockRequest = () => {
      const req = {
        'query': {
          'start_date': null,
          'end_date': '2021-03-22',
          'transaction_type_id': 1,
          'limit': 5
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
    const expected = { error: 'Bad Request: invalid query' }
    await getPopularSnacks(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected) 
  })

  it ('should reject with 400 - end_date is null', async () => {
    const mockRequest = () => {
      const req = {
        'query': {
          'start_date': '2021-03-11',
          'end_date': null,
          'transaction_type_id': 1,
          'limit': 5
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
    const expected = { error: 'Bad Request: invalid query' }
    await getPopularSnacks(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected) 
  })

  it ('should reject with 400 - transaction_type_id is null', async () => {
    const mockRequest = () => {
      const req = {
        'query': {
          'start_date': '2021-03-11',
          'end_date': '2021-03-22',
          'transaction_type_id': null,
          'limit': 5
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
    const expected = { error: 'Bad Request: invalid query' }
    await getPopularSnacks(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected) 
  })

  it ('should reject with 400 - limit is null', async () => {
    const mockRequest = () => {
      const req = {
        'query': {
          'start_date': null,
          'end_date': '2021-03-22',
          'transaction_type_id': 1,
          'limit': null
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
    const expected = { error: 'Bad Request: invalid query' }
    await getPopularSnacks(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected) 
  })

  it ('should get popular snacks', async () => {
    const mockRequest = () => {
      const req = {
        'query': {
          'start_date': '2021-03-11',
          'end_date': '2021-03-22',
          'transaction_type_id': 1,
          'limit': 5
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
    const expected = convertToMapArray([
      {
        'snack_name': 'The Marshmallow that Bob Left On The Table Last Week ',
        'total_quantity': '1118'
      },
      {
        'snack_name': 'KitKat',
        'total_quantity': '1021'
      },
      {
        'snack_name': "Lay's",
        'total_quantity': '1000'
      },
      {
        'snack_name': 'Tomato',
        'total_quantity': '997'
      },
      {
        'snack_name': "M&M's",
        'total_quantity': '614'
      }
    ])
    await getPopularSnacks(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe ('POST /transactions', () => {
  let req, res
  beforeAll (async () => {
    jest.spyOn(instance, 'transaction').mockImplementation(() => {
      const transaction = req.body
      const {
        transaction_type_id, user_id, snack_id,
        transaction_amount, quantity,
      } = transaction
      if (user_id !== 1) {
        return res.status(404).json({ error: 'user_id does not exist in the users table' })
      }
      if (snack_id !== 1) {
        return res.status(404).json({ error: 'snack_id does not exist in the snacks table' })
      }
      if (transaction_amount < 0) throw Error('Bad Request: transaction_amount should be positive.')
      if (quantity <= 0) throw Error('Bad Request: quantity should be positive.')
      const result = {
        'transaction_id': 1,
        'user_id': user_id,
        'transaction_type_id': transaction_type_id,
        'snack_name': 'KitKat',
        'transaction_amount': transaction_amount,
        'quantity': quantity,
        'payment_id': null,
        'transaction_dtm': '2021-03-30T22:28:24.022Z'
      }
      return Promise.resolve(result)
    })
  })

  afterAll (async () => jest.clearAllMocks())

  it ('should reject with 404 - user_id not found', async () => {
    const mockRequest = () => {
      const req = {
        'body': {
          'transaction_type_id': 1,
          'user_id': 999,
          'snack_id': 1,
          'transaction_amount': 125,
          'quantity': 1
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
    const expected = { error: 'user_id does not exist in the users table' }
    await addTransaction(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should reject with 404 - snack_id not found', async () => {
    const mockRequest = () => {
      const req = {
        'body': {
          'transaction_type_id': 1,
          'user_id': 1,
          'snack_id': 999,
          'transaction_amount': 125,
          'quantity': 1
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
    const expected = { error: 'snack_id does not exist in the snacks table' }
    await addTransaction(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should reject with 400 - transaction_amount is not positive', async () => {
    const mockRequest = () => {
      const req = {
        'body': {
          'transaction_type_id': 1,
          'user_id': 1,
          'snack_id': 1,
          'transaction_amount': -125,
          'quantity': 1
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
    const expected = { error: 'Bad Request: transaction_amount should be positive.' }
    await addTransaction(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should reject with 400 - quantity is not positive', async () => {
    const mockRequest = () => {
      const req = {
        'body': {
          'transaction_type_id': 1,
          'user_id': 1,
          'snack_id': 1,
          'transaction_amount': 125,
          'quantity': -1
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
    const expected = { error: 'Bad Request: quantity should be positive.' }
    await addTransaction(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should create a new transaction', async () => {
    const mockRequest = () => {
      const req = {
        'body': {
          'transaction_type_id': 1,
          'user_id': 1,
          'snack_id': 1,
          'transaction_amount': 125,
          'quantity': 1
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
      'transaction_id': 1,
      'user_id': 1,
      'transaction_type_id': 1,
      'snack_name': 'KitKat',
      'transaction_amount': 125,
      'quantity': 1,
      'payment_id': null,
      'transaction_dtm': '2021-03-30T22:28:24.022Z'
    }
    await addTransaction(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})
