import { db, disconnect } from '../../../src/db/index.js'
import { createTestToken } from '../../../src/auth/controller.js'
import axios from 'axios'

const Snacks = db.snacks 
const testSnackData = {
  snack_name: 'test_snack',
  snack_type_id: 1,
  description: 'test',
  image_uri: 'https://test.com',
  quantity: 10,
  price: 100,
  is_active: true,
  order_threshold: 100,
  last_updated_by: 'test',
  expiration_dtm: '2021-03-13T21:01:16.815Z'
}

const testSnackData_inactive = {
  snack_name: 'inactive_test_snack',
  snack_type_id: 1,
  description: 'inactive_test_snack',
  image_uri: 'https://inactive_test_snack.com',
  quantity: 10,
  price: 100,
  is_active: false,
  order_threshold: 100,
  last_updated_by: 'inactive_test_snack',
  expiration_dtm: '2021-03-13T21:01:16.815Z'
}

const inValidTestSnackData = {
  snack_type_id: 1,
  description: 'test',
  image_uri: 'https://test.com',
  quantity: 10,
  price: 100,
  is_active: true,
  order_threshold: 100,
  last_updated_by: 'test',
  expiration_dtm: '2021-03-13T21:01:16.815Z'
}

describe('POST /snacks', () => {
  let token 
  let testSnackId

  beforeAll(() => {
    return initializeSnackTest()
  })

  const initializeSnackTest = () => {
    token = createTestToken()
  }

  afterAll(async () => {
    await clearUserDatabase()
  })

  const clearUserDatabase = async () => {
    await Snacks.destroy({ where: { snack_id: testSnackId } ,force: true })
  }

  it('should add a new snack', async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/snacks', testSnackData, authHeader)
    const testSnack = response.data
    testSnackId = testSnack.snack_id
    expect(response.status).toBe(201)
  })

  it('should not add a new snack with invalid request body', async() => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    try {
      await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/snacks', inValidTestSnackData, authHeader)
    } catch (error) {
      expect(error.response.status).toBe(400)
    }
  }) 

  it('should not add a duplicate snack', async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    try {
      await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/snacks', testSnackData, authHeader)
    } catch (error) {
      expect(error.response.status).toBe(409)
    }
  })
})

describe('GET /snacks', () => {
  let token 
  let testSnackId
  let testSnack
  let testInactiveSnackId
  let testInactiveSnack
  
  beforeAll(async () => {
    intializeSnackTest()
    await addDummySnacks()
  })
  
  const intializeSnackTest = () => {
    token = createTestToken()
  }

  const addDummySnacks = async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    let response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/snacks', testSnackData, authHeader)
    testSnack = response.data
    testSnackId = testSnack.snack_id
    expect(response.status).toBe(201)

    response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/snacks', testSnackData_inactive, authHeader)
    testInactiveSnack = response.data
    testInactiveSnackId = testInactiveSnack.snack_id
    expect(response.status).toBe(201)
  }
  
  afterAll(async () => {
    await clearUserDatabase()
  })
  
  const clearUserDatabase = async () => {
    await Snacks.destroy({ where: { snack_id: testSnackId } ,force: true })
    await Snacks.destroy({ where: { snack_id: testInactiveSnackId } ,force: true })
  }

  it('should get active snacks - default', async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get('https://snacktrack-back-stg.herokuapp.com/api/v1/snacks', authHeader)
    expect(response.status).toBe(200)
    const data = response.data.snacks
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({ snack_name: testSnackData.snack_name }),
        expect.objectContaining({ description: testSnackData.description }),
        expect.objectContaining({ snack_type_id: testSnackData.snack_type_id }),
        expect.objectContaining({ quantity: testSnackData.quantity }),
        expect.objectContaining({ price: testSnackData.price }),
        expect.objectContaining({ order_threshold: testSnackData.order_threshold }),
        expect.objectContaining({ image_uri: testSnackData.image_uri }),
        expect.objectContaining({ last_updated_by: testSnackData.last_updated_by }),
        expect.objectContaining({ is_active: testSnackData.is_active }),
      ]))
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.not.objectContaining({ snack_name: testInactiveSnack.snack_name }),
        expect.not.objectContaining({ description: testInactiveSnack.description }),
        expect.not.objectContaining({ snack_type_id: testInactiveSnack.snack_type_id }),
        expect.not.objectContaining({ quantity: testInactiveSnack.quantity }),
        expect.not.objectContaining({ price: testInactiveSnack.price }),
        expect.not.objectContaining({ order_threshold: testInactiveSnack.order_threshold }),
        expect.not.objectContaining({ image_uri: testInactiveSnack.image_uri }),
        expect.not.objectContaining({ last_updated_by: testInactiveSnack.last_updated_by }),
        expect.not.objectContaining({ is_active: testInactiveSnack.is_active }),
      ]))
  })

  it('should get inactive snacks', async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get('https://snacktrack-back-stg.herokuapp.com/api/v1/snacks/?active=false', authHeader)
    expect(response.status).toBe(200)
    const data = response.data.snacks
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({ snack_name: testInactiveSnack.snack_name }),
        expect.objectContaining({ description: testInactiveSnack.description }),
        expect.objectContaining({ snack_type_id: testInactiveSnack.snack_type_id }),
        expect.objectContaining({ quantity: testInactiveSnack.quantity }),
        expect.objectContaining({ price: testInactiveSnack.price }),
        expect.objectContaining({ order_threshold: testInactiveSnack.order_threshold }),
        expect.objectContaining({ image_uri: testInactiveSnack.image_uri }),
        expect.objectContaining({ last_updated_by: testInactiveSnack.last_updated_by }),
        expect.objectContaining({ is_active: testInactiveSnack.is_active }),
      ]))
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.not.objectContaining({ snack_name: testSnackData.snack_name }),
        expect.not.objectContaining({ description: testSnackData.description }),
        expect.not.objectContaining({ snack_type_id: testSnackData.snack_type_id }),
        expect.not.objectContaining({ quantity: testSnackData.quantity }),
        expect.not.objectContaining({ price: testSnackData.price }),
        expect.not.objectContaining({ order_threshold: testSnackData.order_threshold }),
        expect.not.objectContaining({ image_uri: testSnackData.image_uri }),
        expect.not.objectContaining({ last_updated_by: testSnackData.last_updated_by }),
        expect.not.objectContaining({ is_active: testSnackData.is_active }),
      ]))
  })

  it('should get active snacks with invalid query param', async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get('https://snacktrack-back-stg.herokuapp.com/api/v1/snacks/?active=invalid', authHeader)
    expect(response.status).toBe(200)
    const data = response.data.snacks
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({ snack_name: testSnackData.snack_name }),
        expect.objectContaining({ description: testSnackData.description }),
        expect.objectContaining({ snack_type_id: testSnackData.snack_type_id }),
        expect.objectContaining({ quantity: testSnackData.quantity }),
        expect.objectContaining({ price: testSnackData.price }),
        expect.objectContaining({ order_threshold: testSnackData.order_threshold }),
        expect.objectContaining({ image_uri: testSnackData.image_uri }),
        expect.objectContaining({ last_updated_by: testSnackData.last_updated_by }),
        expect.objectContaining({ is_active: testSnackData.is_active }),
      ]))
    expect(data).toEqual(          
      expect.arrayContaining([      
        expect.not.objectContaining({ snack_name: testInactiveSnack.snack_name }),
        expect.not.objectContaining({ description: testInactiveSnack.description }),
        expect.not.objectContaining({ snack_type_id: testInactiveSnack.snack_type_id }),
        expect.not.objectContaining({ quantity: testInactiveSnack.quantity }),
        expect.not.objectContaining({ price: testInactiveSnack.price }),
        expect.not.objectContaining({ order_threshold: testInactiveSnack.order_threshold }),
        expect.not.objectContaining({ image_uri: testInactiveSnack.image_uri }),
        expect.not.objectContaining({ last_updated_by: testInactiveSnack.last_updated_by }),
        expect.not.objectContaining({ is_active: testInactiveSnack.is_active }),
      ]))
  })

})

describe('PUT /sancks', () => {
  let token 
  let testSnackId
  let testSnack
  const newPrice = 500
  
  beforeAll(async () => {
    intializeSnackTest()
    await addDummySnacks()
  })
  
  const intializeSnackTest = () => {
    token = createTestToken()
  }

  const addDummySnacks = async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/snacks', testSnackData, authHeader)
    testSnack = response.data
    testSnackId = testSnack.snack_id
    expect(response.status).toBe(201)
  }
  
  afterAll(async () => {
    await clearUserDatabase()
  })
  
  const clearUserDatabase = async () => {
    await Snacks.destroy({ where: { snack_id: testSnackId } ,force: true })
  }

  it('edit snack property', async () => {
    const newSnackInfo = { 'price' : newPrice }
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.put(`https://snacktrack-back-stg.herokuapp.com/api/v1/snacks/${testSnackId}`, newSnackInfo, authHeader)
    const data = response.data
    expect(response.status).toBe(200)
    expect(data.price).toEqual(newPrice)
  })
})

describe('DELETE /sancks', () => {
  let token 
  let testSnackId

  beforeAll(async () => {
    intializeSnackTest()
    await addDummySnacks()
  })
  
  const intializeSnackTest = () => {
    token = createTestToken()
  }

  const addDummySnacks = async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/snacks', testSnackData, authHeader)
    testSnackId = response.data.snack_id
    expect(response.status).toBe(201)
  }

  afterAll(async () => {
    await clearUserDatabase()
  })
  
  const clearUserDatabase = async () => {
    await Snacks.destroy({ where: { snack_id: testSnackId } ,force: true })
  }

  it('delete snack', async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.delete(`https://snacktrack-back-stg.herokuapp.com/api/v1/snacks/${testSnackId}`, authHeader)
    expect(response.status).toBe(204)
  })

  it('should not delete snack twice', async () => {
    try {
      const authHeader = { headers: { Authorization: `Bearer ${token}` } }
      await axios.delete(`https://snacktrack-back-stg.herokuapp.com/api/v1/snacks/${testSnackId}`, authHeader)
    } catch(error) {
      expect(error.response.status).toBe(404)
    }
  })

  it('should not delete a snack with invalid snack_id', async () => {
    try {
      const authHeader = { headers: { Authorization: `Bearer ${token}` } }
      const inValidId = 9999
      await axios.delete(`https://snacktrack-back-stg.herokuapp.com/api/v1/snacks/${inValidId}`, authHeader)
    } catch(error) {
      expect(error.response.status).toBe(404)
    }
  })
})

afterAll(async () => {
  await disconnect()
})
