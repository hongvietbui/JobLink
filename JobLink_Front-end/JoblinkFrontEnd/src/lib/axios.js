import { META } from '#utils/helper/env.js'
import axios from 'axios'
import { toast } from 'react-toastify'
import { redirect } from 'vike/abort'

import refreshToken from './authenHelper'

import axiosRetry from 'axios-retry'

import { convertParams } from './convertParams'


//axios.defaults.baseURL = (META.BASE_URL ?? 'http://localhost:3000') as string
axios.defaults.withCredentials = true
axios.defaults.timeout = 1000

const responseBody = (response)=> {
  return response.data.data
}

// Config axios retry
axiosRetry(axios, {
  retries: 1,
  retryDelay: (retryCount) => {
    return retryCount * 1000
  },
  retryCondition: (error) => {
    if (error.response && error.response.status === 401) {
      return false
    }
    return (error.response && error.response.status >= 500) || error.code === 'ECONNABORTED'
  },
})

axios.interceptors.request.use(async (config) => {
  
  return config
})

axios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { data, status } = error.response
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors = []
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key])
            }
          }
          throw modelStateErrors.flat()
        }
        toast.error(data.title)
        break
      case 401:
        if (data.message === 'Access token has expired') {
          return refreshToken(error)
        }
        break

      case 403:
        toast.error('You are not allowed to do that!')
        break
      case 500:
        throw redirect('/login')
        break
      default:
        break
    }
    return Promise.reject(error.response)
  },
)

const requests = {
  get:(url, params) =>
    axios
      .get(url, {
        params,
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(responseBody),
  post: async (url, body) => {
    return axios
      .post(url, body, {
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(responseBody)
  },
  put: async (url, body) => {
    return axios
      .put(url, body, {
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(responseBody)
  },
  del: async (url, params) => {
    return axios
      .delete(url, {
        params,
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(responseBody)
  },
  postFile: async (url, data)=> {
    return axios
      .post(url, data, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      })
      .then(responseBody)
  },
  putFile: async (url, data) => {
    return axios
      .put<ApiResponse<T>>(url, data, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      })
      .then(responseBody)
  },
  postFront: async (url, body) => {
    return axios
      .post(url, body, {
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(responseBody)
  },
  delFront: async (url, params) => {
    return axios
      .delete(url, {
        params,
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(responseBody)
  },
}

const CsrfToken = {
  getCsrf: () => requests.get(META.BACKEND + '/api/Csrf/token'),
}

const Account = {
  login: (values) =>
    requests.post(META.BACKEND + '/api/Auth/signin-google', values),
  logout: (values) =>
    requests.postFront(META.BACKEND + '/api/Auth/logout', values),
  refreshToken: (values) =>
    requests.post(META.BACKEND + '/api/Auth/refresh-token', values),
  addRefreshToken: (values) => requests.postFront('/_auth/add-token', values),
  getRefreshToken: () => requests.get('/_auth/get-refresh-token'),
  removeRefreshToken: () => requests.delFront('/_auth/remove-token'),
}

const Attendance = {
  list: (params) =>
    requests.get(META.BACKEND + '/api/attendance', convertParams(params)),
  getFile: (params) =>
    requests.get(
      META.BACKEND + '/api/attendance/file',
      new URLSearchParams({
        filter: params,
      }),
    ),
}

const EmailTemplate = {
  list: () => requests.get(META.BACKEND + '/api/email-template'),
}


const agent = {
  CsrfToken,
  Account,
  Attendance,
  EmailTemplate,
}

export default agent
