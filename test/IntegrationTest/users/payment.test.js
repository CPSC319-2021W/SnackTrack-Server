import { db, disconnect } from '../../../src/db/index.js'
import { createTestToken } from '../../../src/auth/controller.js'
import axios from 'axios'

const Users = db.users 
const Snacks = db.snacks
const Transactions = db.transactions
const Payments = db.Payments

const testSnackData = {
  snack_name: 'testSnack',
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

const testUserData = {
  username: 'testUser',
  first_name: 'test',
  last_name: 'test',
  email_address: 'test_user_email@gmail.com',
  image_uri: 'https://test.com'
}

const transactionTypeId = 1
const transactionAmount = 400
const quantity = 2
const created_by = 'dummy'
const payment_amount = 400

describe('GET /users/{userId}/payments', () => {
  let token 
  let testSnackId
  let testUserId
  let testTransactionId
  let testPaymentId

  beforeAll(async () => {
    initializeUserTest()
    await addDummySnacks()
    await addDummyUser()
    await addDummyTransaction()
    await addDummyPayment()
  })

  const initializeUserTest = () => {
    token = createTestToken()
  }

  const addDummySnacks = async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/snacks', testSnackData, authHeader)
    const testSnack = response.data
    testSnackId = testSnack.snack_id
    expect(response.status).toBe(201)
  }

  const addDummyUser = async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/users', testUserData, authHeader)
    const testUser = response.data
    testUserId = testUser.user_id
    expect(response.status).toBe(201)
  }

  const addDummyTransaction = async () => {
    const testTransactionData = {
      'user_id': testUserId,
      'transaction_type_id': transactionTypeId,
      'snack_id': testSnackId,
      'transaction_amount': transactionAmount,
      'quantity': quantity
    }
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/transactions', testTransactionData, authHeader)
    const testTransaction = response.data
    testTransactionId = testTransaction.transaction_id
    expect(response.status).toBe(201)
  }

  const addDummyPayment = async () => {
    const testPaymentData = {
      'user_id': testUserId,
      'created_by': created_by,
      'payment_amount': payment_amount,
      'transaction_ids': [testTransactionId]
    }
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.post('https://snacktrack-back-stg.herokuapp.com/api/v1/payments', testPaymentData, authHeader)
    const testPayment = response.data
    testPaymentId = testPayment.payment_id
    expect(response.status).toBe(201)
  }

  afterAll(async () => {
    await clearUserDatabase()
  })

  const clearUserDatabase = async () => {
    await Snacks.destroy({ where: { snack_id: testSnackId } ,force: true })
    await Users.destroy({ where: { user_id: testUserId } ,force: true })
    await Transactions.destroy({ where: { transaction_id: testTransactionId } ,force: true })
    await Payments.destroy({ where: { payment_id: testPaymentId } ,force: true })
  }

  it('should get a payment record', async () => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get(`https://snacktrack-back-stg.herokuapp.com/api/v1/users/${testUserId}/payments/`, authHeader)
    expect(response.status).toBe(200)
    const data = response.data.payments
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ payment_id: testPaymentId })
      ]))    
  })
})

afterAll(async () => {
  await disconnect()
})
