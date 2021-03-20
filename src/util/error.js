// Reference: PostgreSQL error code documentation
// https://www.postgresql.org/docs/8.2/errcodes-appendix.html

const NOT_NULL = '23502'
const UNIQUE = '23505'

export const errorCode = (err) => {
  if (err.message.startsWith('Bad Request:')) {
    return 400
  }
  if (err.parent) {
    if (err.parent.code === NOT_NULL) {
      return 400
    }
    if (err.parent.code === UNIQUE) {
      return 409
    }
  }
  return 500
}
