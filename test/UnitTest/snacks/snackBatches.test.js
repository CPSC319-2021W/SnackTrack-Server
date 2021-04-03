import { db } from '../../../src/db/index.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, it, jest } from '@jest/globals'
import { addSnackBatches, putSnackBatches, deleteSnackBatches, getSnackBatches } from '../../../src/snack/controller.js'

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
          quantity: -1
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

describe('PUT/ snack_batches', () => {
  beforeEach(async() => {
    const prevVal = {
      snack_batch_id: 1,
      quantity: 1,
      expiration_dtm: '2021-06-29T07:22Z'
    }
    jest.spyOn(SnackBatches, 'findByPk').mockImplementation((snack_batch_id) => {
      if (snack_batch_id === 1) {
        return Promise.resolve(prevVal)
      } else {
        return Promise.resolve(null)
      }
    })

    jest.spyOn(SnackBatches, 'update').mockImplementation((snack_batch, options) => {
      const found = options.where.snack_batch_id === 1
      const result = [{
        dataValues: {
          snack_batch_id: 1,
          quantity: snack_batch.quantity,
          expiration_dtm: snack_batch.expiration_dtm
        },
        previousDataValues: prevVal,
        _options: {
          isNewRecord: false,
          _schema: null,
          _schemaDelimiter: '',
          raw: true,
          attribute: undefined
        },
        isNewRecord: false
      }]
      if (snack_batch.expiration_dtm === 'null') {
        result[0].dataValues.expiration_dtm = null
      } else if (snack_batch.expiration_dtm === undefined) {
        result[0].dataValues.expiration_dtm = result[0].previousDataValues.expiration_dtm
      } else if (snack_batch.quantity === undefined) {
        result[0].dataValues.quantity = result[0].previousDataValues.quantity
      }
      return Promise.resolve([found, result])
    })
  })

  afterEach(async() => {
    jest.restoreAllMocks()
  })

  it('should change all the fields but id', async () => {
    const mockRequest = () => {
      return {
        body: {
          quantity: 120,
          expiration_dtm: '2021-07-29T07:22Z'
        },
        params: {
          snack_batch_id: 1
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
      quantity: 120,
      expiration_dtm: '2021-07-29T07:22Z'
    }
    await putSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should change only one of the fields', async () => {
    const mockRequest = () => {
      return {
        body: {
          quantity: 14
        },
        params: {
          snack_batch_id: 1
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
      quantity: 14,
      expiration_dtm: '2021-06-29T07:22Z'
    }
    await putSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should be able to change nullable value to null', async () => {
    const mockRequest = () => {
      return {
        body: {
          expiration_dtm: 'null'
        },
        params: {
          snack_batch_id: 1
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
      quantity: 1,
      expiration_dtm: null
    }
    await putSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should return the previous value if the request body is empty', async () => {
    const mockRequest = () => {
      return {
        body: {},
        params: {
          snack_batch_id: 1
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
      quantity: 1,
      expiration_dtm: '2021-06-29T07:22Z'
    }
    await putSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should return an error 400 if request body includes snack_id', async () => {
    const mockRequest = () => {
      return {
        body: {
          snack_id: 34,
          quantity: 20
        },
        params: {
          snack_batch_id: 1
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
    const expected = { error: 'snack_id cannot be changed for snack_batches.' }
    await putSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should return an error 400 if request body includes snack_batch_id', async () => {
    const mockRequest = () => {
      return {
        body: {
          snack_batch_id: 34,
          quantity: 20
        },
        params: {
          snack_batch_id: 1
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
    const expected = { error: 'snack_batch_id cannot be changed for snack_batches.' }
    await putSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should return an error 404 if snack_batch_id cannot be found', async () => {
    const mockRequest = () => {
      return {
        body: {
          quantity: 20
        },
        params: {
          snack_batch_id: 25
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
    const expected = { error: 'snack_batch_id is not found on the snack_batch table.' }
    await putSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe('GET/ snack_batches', () => {
  beforeEach(async() => {
    jest.spyOn(SnackBatches, 'findAll').mockImplementation((options) => {
      if (Object.keys(options.where).length === 0) {
        return Promise.resolve([
          {
            snack_batch_id: 1,
            quantity: 23,
            expiration_dtm: '2021-07-29T07:22Z',
            snack_id: 12
          },
          {
            snack_batch_id: 2,
            quantity: 15,
            expiration_dtm: null,
            snack_id: 12
          },
          {
            snack_batch_id: 3,
            quantity: 320,
            expiration_dtm: '2021-08-29T07:22Z',
            snack_id: 13
          }
        ]
        )
      } else if (options.where.snack_id === 12) {
        return Promise.resolve([
          {
            snack_batch_id: 1,
            quantity: 23,
            expiration_dtm: '2021-07-29T07:22Z',
            snack_id: 12
          },
          {
            snack_batch_id: 2,
            quantity: 15,
            expiration_dtm: null,
            snack_id: 12
          }
        ]
        )
      } else if (options.where.snack_id === 13) {
        return Promise.resolve([
          {
            snack_batch_id: 3,
            quantity: 320,
            expiration_dtm: '2021-08-29T07:22Z',
            snack_id: 13
          }
        ]
        )
      } else {
        return Promise.resolve([])
      }
    })
  })

  afterEach(async() => {
    jest.restoreAllMocks()
  })

  it('should get all snack_batches', async () => {
    const mockRequest = () => {
      return {
        body: {},
        query: {}
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
      snack_batches: [
        {
          snack_batch_id: 1,
          quantity: 23,
          expiration_dtm: '2021-07-29T07:22Z',
          snack_id: 12
        },
        {
          snack_batch_id: 2,
          quantity: 15,
          expiration_dtm: null,
          snack_id: 12
        },
        {
          snack_batch_id: 3,
          quantity: 320,
          expiration_dtm: '2021-08-29T07:22Z',
          snack_id: 13
        }
      ]
    }
    await getSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should get all the batches with snack_id 12', async () => {
    const mockRequest = () => {
      return {
        body: {},
        query: {
          snack_id: 12
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
      snack_batches: [
        {
          snack_batch_id: 1,
          quantity: 23,
          expiration_dtm: '2021-07-29T07:22Z',
          snack_id: 12
        },
        {
          snack_batch_id: 2,
          quantity: 15,
          expiration_dtm: null,
          snack_id: 12
        }
      ]
    }
    await getSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should get all the batches with snack_id 13', async () => {
    const mockRequest = () => {
      return {
        body: {},
        query: {
          snack_id: 13
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
      snack_batches: [
        {
          snack_batch_id: 3,
          quantity: 320,
          expiration_dtm: '2021-08-29T07:22Z',
          snack_id: 13
        }
      ]
    }
    await getSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should get an empty array for snack_id that cannot be found', async () => {
    const mockRequest = () => {
      return {
        body: {},
        query: {
          snack_id: 25
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
      snack_batches: []
    }
    await getSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe('DELETE/ snack_batches', () => {
  beforeAll (async () => {
    jest.spyOn(SnackBatches, 'destroy').mockImplementation((options) => {
      if (options.where.snack_batch_id === 1) {
        return Promise.resolve(1)
      } else {
        return Promise.resolve(0)
      }
    })
  })

  afterAll (() => {
    jest.clearAllMocks()
  })

  it ('should delete snack_batch', async () => {
    const mockRequest = () => {
      return {
        params: {
          snack_batch_id: 1
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
    await deleteSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.json).toHaveBeenCalledWith()
  })

  it ('should not delete a snack_batch that cannot be found', async () => {
    const mockRequest = () => {
      return {
        params: {
          snack_batch_id: 222
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
    const expected = { error: 'snack_batch_id is not found on the snack batch table.' }
    await deleteSnackBatches(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})
