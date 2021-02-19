export const getPagination = (page, size) => {
  const limit = size ? +size : 8
  const offset = page ? page * limit : 0
  return { limit, offset }
}

// this function's variables and kind, a parameter, must be the snake_case since they will send to the front-end.
export const getPagingData = (data, page, limit, kind) => {
  const { count: total_rows, rows } = data
  const current_page = page ? +page : 0
  let total_pages = Math.ceil(total_rows / limit)
  if (total_pages === 0) total_pages = 1
  return { total_rows, [kind]: rows, total_pages, current_page }
}
