import { META } from './env'
import axios from 'axios'

import { convertParams } from './convertUrlParams'



//axios.defaults.baseURL = (META.BASE_URL ?? 'http://localhost:3000') as string
axios.defaults.withCredentials = true

const responseBody = (response) => {
  return response.data.data
}


axios.interceptors.request.use(async (config) => {

  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    const originalData = config.data || {} // preserve original body data
    config.data = {
      data: originalData,
      timestamp: Date.now(),
    }
  }
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
  get: (url, params) =>
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
  postFile: async (url, data) => {
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
  loginEmail: (username, password) =>
    requests.post('http://localhost:8080/api/Auth/login', username, password),
  logout: (values) =>
    requests.postFront(META.BACKEND + '/api/Auth/logout', values),
  refreshToken: (values) =>
    requests.post(META.BACKEND + '/api/Auth/refresh-token', values),
  addRefreshToken: (values) => requests.postFront('/_auth/add-token', values),
  getRefreshToken: () => requests.get('/_auth/get-refresh-token'),
  removeRefreshToken: () => requests.delFront('/_auth/remove-token'),
}


const EmailTemplate = {
  list: () => requests.get(META.BACKEND + '/api/email-template'),
}
const EmailInput = {
  OtpSend: (Email) => requests.post('http://localhost:8080/api/Auth/sent-otp', Email),
}
const VerifyOtp = {
  verifyCode: (email, code) => requests.post('http://localhost:8080/api/Auth/verify-otp', email, code),
}
const ForgetPassChange = {
  changePass: (email, password) => requests.post('http://localhost:8080/api/Auth/reset-password', email, password),
}

const User = {
  changePass: (body) => requests.post('https://localhost:8081/api/user/change-password', body),
  homepage: () => requests.get('https://localhost:8081/api/user/homepage'),
  me: () => requests.get('https://localhost:8081/api/user/me'),

}

const Job = {
  getListJobDoneDashboard: (body) => requests.get('https://localhost:8081/api/job', convertParams(body)),
  getStatistical : (params) => requests.get('https://localhost:8081/api/job/statistical', params)
}

const Transaction = {
  createWithdraw: (body) => requests.post('https://localhost:8081/api/transactions', body),
 
}
const Job1 = {
  Listjob: (pageIndex, pageSize, sortBy, isDescending, filter) => {
    const params = {
      pageIndex,
      pageSize,
      sortBy,
      isDescending,
      filter,
    };

    return requests.get('http://localhost:8080/api/Job/get-jobs', { params });
  }
};


const agent = {
  CsrfToken,
  Account,
  User,
  EmailTemplate,
  EmailInput,
  VerifyOtp, ForgetPassChange,
  Job,
  Transaction
}

export default agent
