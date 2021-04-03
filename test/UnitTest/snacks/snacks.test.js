import { db } from '../../../src/db/index.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, it, jest } from '@jest/globals'
import { addSnack, putSnacks } from '../../../src/snack/controller.js'

const Snacks = db.snacks
const instance = db.dbInstance

describe('POST/ snacks', () => {
  let req, res
  beforeAll(async () => {
    jest.spyOn(instance, 'transaction').mockImplementation(() => {
      const snack = req.body
      if (snack.quantity < 0) {
        return res.status(400).json({ error: 'quantity must be greater than 0!' })
      }
      const quantity = 0
      const result = {
        snack_id: 1,
        snack_type_id: snack.snack_type_id,
        snack_name: snack.snack_name,
        description: snack.description,
        image_uri: snack.image_uri,
        price: snack.price,
        is_active: snack.is_active,
        order_threshold: snack.order_threshold,
        last_updated_dtm: '2021-04-02T07:22Z',
        last_updated_by: snack.last_updated_by,
        quantity: quantity
      }
      if (snack.quantity !== undefined) {
        result.quantity = snack.quantity
      }
      return Promise.resolve(result)
    })
  })

  afterAll (async () => jest.clearAllMocks())

  it('should add a snack with zero quantity', async () => {
    const mockRequest = () => {
      return {
        body: {
          snack_type_id: 1,
          snack_name: 'TestSnack',
          description: 'This is a test snack',
          image_uri: 'https://testImage.ca/testSnack',
          price: 400,
          is_active: true,
          order_threshold: 12,
          last_updated_by: 'Howard'
        }
      }
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
      snack_id: 1,
      snack_type_id: 1,
      snack_name: 'TestSnack',
      description: 'This is a test snack',
      image_uri: 'https://testImage.ca/testSnack',
      price: 400,
      is_active: true,
      order_threshold: 12,
      last_updated_dtm: '2021-04-02T07:22Z',
      last_updated_by: 'Howard',
      quantity: 0
    }
    await addSnack(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should add a snack with non-zero quantity', async () => {
    const mockRequest = () => {
      return {
        body: {
          snack_type_id: 1,
          snack_name: 'TestSnack',
          description: 'This is a test snack',
          image_uri: 'https://testImage.ca/testSnack',
          price: 1,
          is_active: true,
          order_threshold: 12,
          last_updated_by: 'Howard',
          quantity: 20
        }
      }
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
      snack_id: 1,
      snack_type_id: 1,
      snack_name: 'TestSnack',
      description: 'This is a test snack',
      image_uri: 'https://testImage.ca/testSnack',
      price: 1,
      is_active: true,
      order_threshold: 12,
      last_updated_dtm: '2021-04-02T07:22Z',
      last_updated_by: 'Howard',
      quantity: 20
    }
    await addSnack(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should not add a snack with negative quantity', async () => {
    const mockRequest = () => {
      return {
        body: {
          snack_type_id: 1,
          snack_name: 'TestSnack',
          description: 'This is a test snack',
          image_uri: 'https://testImage.ca/testSnack',
          price: 400,
          is_active: true,
          order_threshold: 12,
          last_updated_by: 'Howard',
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
    req = mockRequest()
    res = mockResponse()
    const expected = { error: 'quantity, price, and order_threshold cannot be a negative number!' }
    await addSnack(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe('PUT/ snacks', () => {
  beforeEach(async () => {
    const prevVal = {
      snack_id: 1,
      snack_type_id: 1,
      snack_name: 'TestSnack',
      description: 'This is a test snack',
      image_uri: 'https://testImage.ca/testSnack',
      price: 400,
      is_active: true,
      order_threshold: 12,
      last_updated_dtm: '2021-04-02T07:22Z',
      last_updated_by: 'Howard',
    }

    jest.spyOn(Snacks, 'findByPk').mockImplementation((snack_id) => {
      if (snack_id === 1) {
        return Promise.resolve(prevVal)
      } else {
        return Promise.resolve(null)
      }
    })

    jest.spyOn(Snacks, 'update').mockImplementation((snack, options) => {
      const found = options.where.snack_id === 1
      const result = [{
        dataValues: prevVal,
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
      const data = result[0].dataValues
      for (const key in data) {
        if(Object.prototype.hasOwnProperty.call(snack, key)) {
          data[key] = snack[key]
        }
      }
      if (snack.order_threshold === 'null') {
        data.order_threshold = null
      }
      return Promise.resolve([found, result])
    })
  })

  afterEach(async() => {
    jest.restoreAllMocks()
  })

  it('should change all the fields in the snack', async () => {
    const mockRequest = () => {
      return {
        body: {
          snack_type_id: 3,
          snack_name: 'TestSnackBlah',
          description: 'test snack',
          image_uri: 'https://testImage.ca/lol',
          price: 555,
          is_active: false,
          order_threshold: 2,
          last_updated_by: 'HHH'
        },
        params: {
          snack_id: 1
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
      snack_id: 1,
      snack_type_id: 3,
      snack_name: 'TestSnackBlah',
      description: 'test snack',
      image_uri: 'https://testImage.ca/lol',
      price: 555,
      is_active: false,
      order_threshold: 2,
      last_updated_dtm: '2021-04-02T07:22Z',
      last_updated_by: 'HHH'
    }
    await putSnacks(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should change some of the fields in the snack', async () => {
    const mockRequest = () => {
      return {
        body: {
          snack_name: 'TestSnack2',
          price: 35,
          last_updated_by: 'HB'
        },
        params: {
          snack_id: 1
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
      snack_id: 1,
      snack_type_id: 1,
      snack_name: 'TestSnack2',
      description: 'This is a test snack',
      image_uri: 'https://testImage.ca/testSnack',
      price: 35,
      is_active: true,
      order_threshold: 12,
      last_updated_dtm: '2021-04-02T07:22Z',
      last_updated_by: 'HB'
    }
    await putSnacks(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})
