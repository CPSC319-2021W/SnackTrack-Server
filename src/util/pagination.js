export const getPagination = (page, size) => {
  const limit = size ? +size : 8
  const offset = page ? page * limit : 0
  return { limit, offset }
}
  
export const getPagingData = (data, page, limit) => {
  const { count: totalRows, rows: transactions } = data
  const currentPage = page ? +page : 0
  let totalPages = Math.ceil(totalRows / limit)
  if (totalPages === 0) totalPages = 1
  return { totalRows, transactions, totalPages, currentPage }
}
