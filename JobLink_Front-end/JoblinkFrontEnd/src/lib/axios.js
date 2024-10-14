import { META } from './env'
import axios from 'axios'

import { convertParams } from './convertUrlParams'


//axios.defaults.baseURL = (META.BASE_URL ?? 'http://localhost:3000') as string
axios.defaults.withCredentials = true

const responseBody = (response)=> {
  return response.data.data
}


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
        break
      case 401:
        
        break

      case 403:
        break
      case 500:
       
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
      .put(url, data, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      })
      .then(responseBody)
  }
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
const EmailInput ={
  OtpSend: (Email) => requests.post('https://localhost:8081/api/Auth/sent-otp',Email),
}

const agent = {
  CsrfToken,
  Account,
  Attendance,
  EmailTemplate,
  EmailInput
}

export default agent
