import { db } from '../../../src/db/index.js'
import { getUser, getUsers } from '../../../src/user/controller.js'

const Users = db.users

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
