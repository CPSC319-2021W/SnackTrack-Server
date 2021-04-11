import { db, disconnect } from '../../src/db/index.js'
import { createTestToken } from '../../src/auth/controller.js'
import axios from 'axios'

const Users = db.users 
const inValidToken = 'inValid'
const testUserData = {
  first_name: 'test',
  last_name: 'test',
  email_address: 'test_email@gmail.com',
  image_uri: 'https://test.com'
}

describe('POST /users', () => {
  let token 
  let testUser
  let testUserId

  beforeAll(() => {
    return initializeUserTest()
  })

  const initializeUserTest = () => {
    token = createTestToken()
  }

  afterAll(async () => {
    await clearUserDatabase()
  })

  const clearUserDatabase = async () => {
    await Users.destroy({ where: { user_id: testUserId } ,force: true })
  }

  it('should add a new user', async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/users', testUserData, authHeader)
    testUser = response.data
    testUserId = testUser.user_id
    expect(response.status).toBe(201)
  })
})

describe('GET /users', () => {
  let token 
  let testUser
  let testUserId

  beforeAll(async () => {
    initializeUserTest()
    await addDummyUser()
  })

  const initializeUserTest = () => {
    token = createTestToken()
  }

  const addDummyUser = async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/users', testUserData, authHeader)
    testUser = response.data
    testUserId = testUser.user_id
    expect(response.status).toBe(201)
  }

  afterAll(async () => {
    await clearUserDatabase()
  })

  const clearUserDatabase = async () => {
    await Users.destroy({ where: { user_id: testUserId } ,force: true })
  }

  it('should get a user by id', async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get(`https://snacktrack-back-stg.herokuapp.com/api/v1/users/${testUserId}`, authHeader)
    expect(response.status).toBe(200)
    const data = response.data
    expect(data.first_name).toMatch(testUserData.first_name)
    expect(data.last_name).toMatch(testUserData.last_name)
    expect(data.email_address).toMatch(testUserData.email_address)
    expect(data.image_uri).toMatch(testUserData.image_uri)
    expect(data.is_admin).toBeFalsy()
    expect(data.user_id).not.toBeNull()
  })

  it('should not be able to get users by id without auth token', async() => {
    const authHeader = { headers: { Authorization: `Bearer ${inValidToken}` } }
    try {
      await axios.get('https://snacktrack-back-stg.herokuapp.com/api/v1/users', authHeader)
    } catch(error) {
      expect(error.response.status).toBe(403)
    }
  })

  it('should get a user by email', async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get(`https://snacktrack-back-stg.herokuapp.com/api/v1/users/?email_address=${testUserData.email_address}`, authHeader)
    expect(response.status).toBe(200)
    const data = response.data.users[0]
    expect(data.first_name).toMatch(testUserData.first_name)
    expect(data.last_name).toMatch(testUserData.last_name)
    expect(data.email_address).toMatch(testUserData.email_address)
    expect(data.image_uri).toMatch(testUserData.image_uri)
    expect(data.is_admin).toBeFalsy()
    expect(data.user_id).not.toBeNull()
  })

  it('should get users that', async() => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get(`https://snacktrack-back-stg.herokuapp.com/api/v1/users`, authHeader)
    expect(response.status).toBe(200)
    const data = response.data.users

    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({   
          first_name: testUserData.first_name
        })               
      ])
    )
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({   
          last_name: testUserData.last_name
        })               
      ])
    )
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({   
          email_address: testUserData.email_address
        })               
      ])
    )
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({   
          image_uri: testUserData.image_uri
        })               
      ])
    )
  })

  it('should get users for iPad module', async() => {
    const response = await axios.get(`https://snacktrack-back-stg.herokuapp.com/api/v1/users/common`)
    expect(response.status).toBe(200)
  })
})

describe('DELETE /users', () => {
  const inValidUserId = 999999
  let token 
  let testUser
  let testUserId

  beforeAll(async () => {
    token = createTestToken()
    await addDummyUser()
  })

  afterAll(async () => {
    await clearUserDatabase()
  })

  const clearUserDatabase = async () => {
    await Users.destroy({ where: { user_id: testUserId } ,force: true })
  }

  const addDummyUser = async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/users', testUserData, authHeader)
    testUser = response.data
    testUserId = testUser.user_id
    expect(response.status).toBe(201)
  }
  
  it('should delete a valid user', async() => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.delete(`https://snacktrack-back-stg.herokuapp.com/api/v1/users/${testUserId}`, authHeader)
    expect(response.status).toBe(200)
    try {
      await axios.get(`https://snacktrack-back-stg.herokuapp.com/api/v1/users/${testUserId}`, authHeader)
    } catch(error) {
      expect(error.response.status).toBe(404)
    }
  }) 

  it('should not delete an invalid user', async() => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    try { 
      await axios.delete(`https://snacktrack-back-stg.herokuapp.com/api/v1/users/${inValidUserId}`, authHeader)
    } catch(error) {
      expect(error.response.status).toBe(404)
    }
  })
})

afterAll(async () => {
  await disconnect()
})
