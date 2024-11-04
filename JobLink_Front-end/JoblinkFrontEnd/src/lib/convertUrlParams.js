export const convertParams = (params) => {
    const searchParams = new URLSearchParams()
  
    if (params) {
      // Lấy tất cả keys từ params
      Object.keys(params).forEach((key) => {
        const value = params[key]
        if (value !== undefined) {
          // Kiểm tra xem giá trị có phải là Date không
          if (value instanceof Date) {
            searchParams.append(key, value.toISOString())
          } else {
            searchParams.append(key, String(value))
          }
        }
      })
    }
  
    return searchParams
  }