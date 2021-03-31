import { db } from '../../../src/db/index.js'
import { afterEach, beforeEach, describe, it, jest } from '@jest/globals'
import { addSnackBatches } from '../../../src/snack/controller.js'

const SnackBatches = db.snackBatches

describe('POST/ snack_batches', () => {
  beforeEach(async () => {
    jest.spyOn(SnackBatches, 'create').mockImplementation((snack_batch) => {
      let expiration_dtm
      if (snack_batch.expiration_dtm !== undefined) {
        expiration_dtm = snack_batch.expiration_dtm
      } else {
        expiration_dtm = null
      }
      return Promise.resolve({
        snack_batch_id: 1,
        quantity: snack_batch.quantity,
        expiration_dtm: expiration_dtm
      })
    })
  })

  afterEach(async() => {
    jest.restoreAllMocks()
  })

  it('should add a snack_batch', async () => {
    const mockRequest = () => {
      return {
        body: {
          quantity: 20,
          expiration_dtm: '2021-07-29T07:22Z'
        }
      }
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
      snack_batch_id: 1,
      quantity: 20,
      expiration_dtm: '2021-07-29T07:22Z'
    }
    await addSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should add a snack_batch without expiration date', async () => {
    const mockRequest = () => {
      return {
        body: {
          quantity: 55
        }
      }
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
      snack_batch_id: 1,
      quantity: 55,
      expiration_dtm: null
    }
    await addSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should not add a snack_batch with negative quantity', async () => {
    const mockRequest = () => {
      return {
        body: {
          quantity: -100
        }
      }
    }
    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }
    const req = mockRequest()
    const res = mockResponse()
    const expected = { error : 'quantity must be greater than 0!' }
    await addSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})
