import { db } from '../../../src/db/index.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, it, jest } from '@jest/globals'
import { addSnack, putSnacks, getSnacks } from '../../../src/snack/controller.js'
import * as controller from '../../../src/snack/controller.js'

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

  it('should change nullable fields in the snack to null', async () => {
    const mockRequest = () => {
      return {
        body: {
          order_threshold: 'null'
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
      snack_name: 'TestSnack',
      description: 'This is a test snack',
      image_uri: 'https://testImage.ca/testSnack',
      price: 400,
      is_active: true,
      order_threshold: null,
      last_updated_dtm: '2021-04-02T07:22Z',
      last_updated_by: 'Howard'
    }
    await putSnacks(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should not change the snack_id', async () => {
    const mockRequest = () => {
      return {
        body: {
          snack_id: 23,
          price: 66,
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
    const expected = { error: 'snack_id cannot be changed for snacks.' }
    await putSnacks(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expected)
  })

  it('should return error 404 if snack_id is not in the database', async () => {
    const mockRequest = () => {
      return {
        body: {
          price: 66,
          last_updated_by: 'HB'
        },
        params: {
          snack_id: 5
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
    const expected = { error: 'snack_id is not found on the snack table.' }
    await putSnacks(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})

describe('GET/snacks', () => {
  beforeAll(async () => {
    jest.spyOn(controller, 'addQuantityFromBatch').mockImplementation((snack) => {
      if (snack.snack_id === 1) {
        snack.quantity = 250
      } else {
        snack.quantity = 0
      }
      return Promise.resolve(snack)
    })

    jest.spyOn(Snacks, 'findAll').mockImplementation((options) => {
      if (Object.keys(options.where).length === 0) {
        return Promise.resolve({
          snacks: [
            {
              snack_id: 22,
              snack_name: 'KitKat - Wasabi Flavour',
              description: 'KitKat in wasabi flavour! Wow',
              image_uri: 'https://testimg.com/kitkat',
              price: 125,
              is_active: true,
              order_threshold: 10,
              last_updated_dtm: '2021-04-04T01:38:43.657Z',
              last_updated_by: 'HyesunAn',
              snack_type_id: 1
            },
            {
              snack_id: 107,
              snack_name: 'Reese',
              description: 'Reese Peanut Buttercups',
              image_uri: 'https://i.ibb.co/0X6pHB6/blob.png',
              price: 125,
              is_active: true,
              order_threshold: null,
              last_updated_dtm: '2021-04-02T23:22:35.830Z',
              last_updated_by: 'JustinWong',
              snack_type_id: 1
            },
            {
              snack_id: 76,
              snack_name: 'High End Steak Cubes',
              description: 'A5 Miyazaki Wagyu Ribeye Steak Cubes. Imported from Japan.',
              image_uri: 'https://Wagyu.img.com',
              price: 2500,
              is_active: true,
              order_threshold: null,
              last_updated_dtm: '2021-04-01T21:35:39.920Z',
              last_updated_by: 'JustinWong',
              snack_type_id: 7
            }
          ]
        })
      } else if (options.where.is_active === true) {
        return Promise.resolve({
          snacks: [
            {
              snack_id: 22,
              snack_name: 'KitKat - Wasabi Flavour',
              description: 'KitKat in wasabi flavour! Wow',
              image_uri: 'https://testimg.com/kitkat',
              price: 125,
              is_active: true,
              order_threshold: 10,
              last_updated_dtm: '2021-04-04T01:38:43.657Z',
              last_updated_by: 'HyesunAn',
              snack_type_id: 1
            },
            {
              snack_id: 76,
              snack_name: 'High End Steak Cubes',
              description: 'A5 Miyazaki Wagyu Ribeye Steak Cubes. Imported from Japan.',
              image_uri: 'https://Wagyu.img.com',
              price: 2500,
              is_active: true,
              order_threshold: null,
              last_updated_dtm: '2021-04-01T21:35:39.920Z',
              last_updated_by: 'JustinWong',
              snack_type_id: 7
            }
          ]
        })
      } else if (options.where.is_active === false) {
        return Promise.resolve({
          snacks: [
            {
              snack_id: 107,
              snack_name: 'Reese',
              description: 'Reese Peanut Buttercups',
              image_uri: 'https://i.ibb.co/0X6pHB6/blob.png',
              price: 125,
              is_active: false,
              order_threshold: null,
              last_updated_dtm: '2021-04-02T23:22:35.830Z',
              last_updated_by: 'JustinWong',
              snack_type_id: 1
            }
          ]
        })
      }
    })
  })

  afterAll (async () => jest.clearAllMocks())

  it('should get all the snacks', async () => {
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
      snacks: [
        {
          quantity: 250,
          snack_id: 22,
          snack_name: 'KitKat - Wasabi Flavour',
          description: 'KitKat in wasabi flavour! Wow',
          image_uri: 'https://testimg.com/kitkat',
          price: 125,
          is_active: true,
          order_threshold: 10,
          last_updated_dtm: '2021-04-04T01:38:43.657Z',
          last_updated_by: 'HyesunAn',
          snack_type_id: 1
        },
        {
          quantity: 0,
          snack_id: 107,
          snack_name: 'Reese',
          description: 'Reese Peanut Buttercups',
          image_uri: 'https://i.ibb.co/0X6pHB6/blob.png',
          price: 125,
          is_active: true,
          order_threshold: null,
          last_updated_dtm: '2021-04-02T23:22:35.830Z',
          last_updated_by: 'JustinWong',
          snack_type_id: 1
        },
        {
          quantity: 0,
          snack_id: 76,
          snack_name: 'High End Steak Cubes',
          description: 'A5 Miyazaki Wagyu Ribeye Steak Cubes. Imported from Japan.',
          image_uri: 'https://Wagyu.img.com',
          price: 2500,
          is_active: true,
          order_threshold: null,
          last_updated_dtm: '2021-04-01T21:35:39.920Z',
          last_updated_by: 'JustinWong',
          snack_type_id: 7
        }
      ]
    }
    await getSnacks(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expected)
  })
})
