import superset from 'supertest'
import app from '../app.js'

const request = superset(app)

// this is a test example
describe('GET /suggestions', () => {
  it('It should create a new suggestion', async () => {
    const response = await request.get('/api/v1/suggestions')
    //  console.log(response.body)
    expect(response.statusCode).toBe(401)
  }) 
})
