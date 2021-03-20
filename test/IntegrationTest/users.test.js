import { db, disconnect } from '../../src/db/index.js'
import { createTestToken } from '../../src/auth/controller.js'
import axios from 'axios'

describe('/users endpoints', () => {
  const Users = db.users 
  const inValidToken = 'invaid'
  let token 
  let testUser
  let testUserId

  
  const testUserData = {
    username: 'testHuh',
    first_name: 'test',
    last_name: 'Huh',
    email_address: 'test@gmail.com',
    image_uri: 'https://test.com'
  }

  beforeAll(() => {
    return initializeUserTest()
  })

  const initializeUserTest = () => {
    token = createTestToken()
  }

  afterAll(async () => {
    await clearUserDatabase()
    await disconnect()
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

  it('should get a user by id', async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get(`https://snacktrack-back-stg.herokuapp.com/api/v1/users/${testUserId}`, authHeader)
    expect(response.status).toBe(200)
    const data = response.data
    expect(data.username).toMatch(testUserData.username)
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
    expect(data.username).toMatch(testUserData.username)
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
          username: 'testHuh'               
        })
      ])
    )
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({   
          first_name: 'test'
        })               
      ])
    )
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({   
          last_name: 'Huh'
        })               
      ])
    )
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({   
          email_address: 'test@gmail.com'
        })               
      ])
    )
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({   
          image_uri: 'https://test.com' 
        })               
      ])
    )
  })

  it('should get users for iPad module', async() => {
    const response = await axios.get(`https://snacktrack-back-stg.herokuapp.com/api/v1/users/common`)
    expect(response.status).toBe(200)
  })

})
