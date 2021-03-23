// import { db, disconnect } from '../../../src/db/index.js'
// import { createTestToken } from '../../../src/auth/controller.js'
// import axios from 'axios'

// const Snacks = db.snacks 
// const testSnackData = {
//   snack_name: 'test',
//   snack_type_id: 1,
//   description: 'test',
//   image_uri: 'https://test.com',
//   quantity: 10,
//   price: 100,
//   is_active: true,
//   order_threshold: 100,
//   last_updated_by: "test",
//   expiration_dtm: "2021-03-13T21:01:16.815Z"
// }

// describe('POST /snacks', () => {
//   let token 
//   let testSnackId

//   beforeAll(() => {
//     return initializeUserTest()
//   })

//   const initializeUserTest = () => {
//     token = createTestToken()
//   }

//   afterAll(async () => {
//     await clearUserDatabase()
//   })

//   const clearUserDatabase = async () => {
//     await Snacks.destroy({ where: { snack_id: testSnackId } ,force: true })
//   }

//   it('should add a new snack', async () => {
//     const authHeader = { headers: { Authorization: `Bearer ${token}` } }
//     const response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/snacks', testSnackData, authHeader)
//     const testSnack = response.data
//     testSnackId = testSnack.snack_id
//     expect(response.status).toBe(201)
//   })
// })

// afterAll(async () => {
//   await disconnect()
// })
