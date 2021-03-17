const DEFAULT_SIZE = 8
const DEFAULT_PAGE_OFFSET = 0

export const getPaginatedData = async (query, where, model, order) => {
  const { page, size } = query
  const limit = size ? +size : DEFAULT_SIZE
  const offset = page ? page * limit : DEFAULT_PAGE_OFFSET
  const data = await model.findAndCountAll({ where, limit, offset, order })
  const { count: total_rows, rows } = data
  const current_page = page ? +page : 0
  let total_pages = Math.ceil(total_rows / limit)
  if (total_pages === 0) total_pages = 1
  return { total_rows, [model.name]: rows, total_pages, current_page }
}
