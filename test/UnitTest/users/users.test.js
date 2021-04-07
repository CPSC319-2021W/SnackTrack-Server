import { db } from '../../../src/db/index.js'
import { addUser, deleteUser, getUser, getUsers, putUsers } from '../../../src/user/controller.js'

const Users = db.users
const instance = db.dbInstance

describe ('GET /users', () => {
  beforeAll (async () => {
    jest.spyOn(Users, 'findAll').mockImplementation((condition) => {
      if (condition.where.email_address) {
        return Promise.resolve([
          {
            'user_id': 1,
            'username': 'test1',
            'first_name': 'test',
            'last_name': 'one',
            'email_address': condition.where.email_address,
            'balance': 0,
            'is_active': true,
            'image_uri': 'https://test1.com',
            'is_admin': true,
            'deleted_at': null
          }
        ])
      } else {
        return Promise.resolve([
          {
            'user_id': 1,
            'username': 'test1',
            'first_name': 'test',
            'last_name': 'one',
            'email_address': 'test1@gmail.com',
            'balance': 0,
            'is_active': true,
            'image_uri': 'https://test1.com',
            'is_admin': true,
            'deleted_at': null
          },
          {
            'user_id': 2,
            'username': 'test2',
            'first_name': 'test',
            'last_name': 'two',
            'email_address': 'test2@gmail.com',
            'balance': 1300,
            'is_active': true,
            'image_uri': 'https://test2.com',
            'is_admin': true,
            'deleted_at': null
          },
          {
            'user_id': 3,
            'username': 'test3',
            'first_name': 'test',
            'last_name': 'three',
            'email_address': 'test3@gmail.com',
            'balance': 3000,
            'is_active': true,
            'image_uri': 'https://test3.com',
            'is_admin': false,
            'deleted_at': null
          }
        ])
      }
    })
  })
  
  afterAll (async () => jest.clearAllMocks())

  it ('should get all users', async () => {
    const mockRequest = () => {
      const req = {
        'query': {
          'email_address': undefined
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
      'users': [
        {
          'user_id': 1,
          'username': 'test1',
          'first_name': 'test',
          'last_name': 'one',
          'email_address': 'test1@gmail.com',
          'balance': 0,
          'is_active': true,
          'image_uri': 'https://test1.com',
          'is_admin': true,
          'deleted_at': null
        },
        {
          'user_id': 2,
          'username': 'test2',
          'first_name': 'test',
          'last_name': 'two',
          'email_address': 'test2@gmail.com',
          'balance': 1300,
          'is_active': true,
          'image_uri': 'https://test2.com',
          'is_admin': true,
          'deleted_at': null
        },
        {
          'user_id': 3,
          'username': 'test3',
          'first_name': 'test',
          'last_name': 'three',
          'email_address': 'test3@gmail.com',
          'balance': 3000,
          'is_active': true,
          'image_uri': 'https://test3.com',
          'is_admin': false,
          'deleted_at': null
        }
      ]
    }
    await getUsers(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should get a user with the email_address', async () => {
    const mockRequest = () => {
      const req = {
        'query': {
          'email_address': 'test1@gmail.com'
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
      'users': [
        {
          'user_id': 1,
          'username': 'test1',
          'first_name': 'test',
          'last_name': 'one',
          'email_address': 'test1@gmail.com',
          'balance': 0,
          'is_active': true,
          'image_uri': 'https://test1.com',
          'is_admin': true,
          'deleted_at': null
        }
      ]
    }
    await getUsers(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe ('GET /users/:user_id', () => {
  beforeAll (async () => {
    jest.spyOn(Users, 'findByPk').mockImplementation((user_id) => {
      if (user_id === 1) {
        return Promise.resolve({
          'user_id': 1,
          'username': 'test1',
          'first_name': 'test',
          'last_name': 'one',
          'email_address': 'test1@gmail.com',
          'balance': 0,
          'is_active': true,
          'image_uri': 'https://test1.com',
          'is_admin': true,
          'deleted_at': null
        })
      } else {
        return Promise.resolve(null)
      }
    })
  })

  afterAll (async () => jest.clearAllMocks())

  it ('should reject with 404 - user_id not found', async () => {
    const mockRequest = () => {
      const req = {
        'params': {
          'user_id': 999
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
    const expected = { error: 'user_id is not found on the users table' }
    await getUser(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should get a user', async () => {
    const mockRequest = () => {
      const req = {
        'params': {
          'user_id': 1
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
      'user_id': 1,
      'username': 'test1',
      'first_name': 'test',
      'last_name': 'one',
      'email_address': 'test1@gmail.com',
      'balance': 0,
      'is_active': true,
      'image_uri': 'https://test1.com',
      'is_admin': true,
      'deleted_at': null
    }
    await getUser(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe ('POST /users', () => {
  beforeAll (async () => {
    jest.spyOn(Users, 'create').mockImplementation((user) => {
      return Promise.resolve({
        'user_id': 1,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email_address': user.email_address,
        'balance': 0,
        'is_active': true,
        'image_uri': user.image_uri,
        'is_admin': false,
        'deleted_at': null
      })
    })
  })

  afterAll (async () => jest.clearAllMocks())

  it ('should create a new user', async () => {
    const mockRequest = () => {
      const req = {
        'body': {
          'username': 'test',
          'first_name': 'test',
          'last_name': 'test',
          'email_address': 'test@gmail.com',
          'image_uri': 'https://test.com'
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
      'user_id': 1,
      'username': 'test',
      'first_name': 'test',
      'last_name': 'test',
      'email_address': 'test@gmail.com',
      'balance': 0,
      'is_active': true,
      'image_uri': 'https://test.com',
      'is_admin': false,
      'deleted_at': null
    }
    await addUser(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe ('PUT /users/:user_id', () => {
  beforeAll (async () => {
    jest.spyOn(Users, 'findByPk').mockImplementation(() => {
      return Promise.resolve({
        'user_id': 1,
        'username': 'test',
        'first_name': 'test',
        'last_name': 'test',
        'email_address': 'test@gmail.com',
        'balance': 0,
        'is_active': true,
        'image_uri': 'https://test.com',
        'is_admin': false,
        'deleted_at': null
      })
    })
    jest.spyOn(Users, 'update').mockImplementation(({ balance, is_admin }, condition) => {
      if (condition.where.user_id === 1) {
        const user = {
          'user_id': 1,
          'username': 'test',
          'first_name': 'test',
          'last_name': 'test',
          'email_address': 'test@gmail.com',
          'balance': balance,
          'is_active': true,
          'image_uri': 'https://test.com',
          'is_admin': is_admin,
          'deleted_at': null
        }
        return Promise.resolve([1, [user]])
      } else {
        return Promise.resolve([0, []])
      }
    })
  })

  afterAll (async () => jest.clearAllMocks())

  it ('should reject with 404 - user_id not found', async () => {
    const mockRequest = () => {
      const req = {
        'params': {
          'user_id': 999
        },
        'body': {
          'balance': 1000,
          'is_admin': true
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
    const expected = { error: 'user_id is not found on the users table' }
    await putUsers(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should get the original user information back - no updates', async () => {
    const mockRequest = () => {
      const req = {
        'params': {
          'user_id': 1
        },
        'body': {
          'balance': undefined,
          'is_admin': undefined
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
      'user_id': 1,
      'username': 'test',
      'first_name': 'test',
      'last_name': 'test',
      'email_address': 'test@gmail.com',
      'balance': 0,
      'is_active': true,
      'image_uri': 'https://test.com',
      'is_admin': false,
      'deleted_at': null
    }
    await putUsers(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe ('DELETE /users/:user_id', () => {
  let req, res
  beforeAll (async () => {
    jest.spyOn(instance, 'transaction').mockImplementation(() => {
      const user_id = req.params.user_id
      let result
      if (user_id === 1) {
        result = [
          {
            'user_id': 1,
            'username': 'test',
            'first_name': 'test',
            'last_name': 'test',
            'email_address': 'test@gmail.com',
            'balance': 0,
            'is_active': false,
            'image_uri': 'https://test.com',
            'is_admin': false,
            'deleted_at': null
          }
        ]
      } else {
        result = []
      }
      if (!result[0]) {
        return res.status(404).json({ error: 'user_id is not found on the users table' })
      }
      result[0].deleted_at = '2012-03-19T07:22Z'
      return Promise.resolve(result[0])
    })
  })

  afterAll (async () => jest.clearAllMocks())

  it ('should reject with 404 - user_id not found', async () => {
    const mockRequest = () => {
      const req = {
        'params': {
          'user_id': 999
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
    const expected = { error: 'user_id is not found on the users table' }
    await deleteUser(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it ('should reject with 404 - user_id not found', async () => {
    const mockRequest = () => {
      const req = {
        'params': {
          'user_id': 1
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
      'user_id': 1,
      'username': 'test',
      'first_name': 'test',
      'last_name': 'test',
      'email_address': 'test@gmail.com',
      'balance': 0,
      'is_active': false,
      'image_uri': 'https://test.com',
      'is_admin': false,
      'deleted_at': '2012-03-19T07:22Z'
    }
    await deleteUser(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})
