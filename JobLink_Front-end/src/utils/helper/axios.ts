import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import axiosRetry from "axios-retry";

import { ApiResponse, LoginResponse } from "@/types/Response/ApiResponse";
import useAuthStore from "@/stores/authState";
import { META } from "@/config/env";

//axios.defaults.baseURL = (META.BASE_URL ?? 'http://localhost:3000') as string
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

const responseBody = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  return response.data.data;
};

// Config axios retry
axiosRetry(axios, {
  retries: 1,
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    if (error.response && error.response.status === 401) {
      return false;
    }

    return (
      (error.response && error.response.status >= 500) ||
      error.code === "ECONNABORTED"
    );
  },
});

axios.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (
    config.method === "post" ||
    config.method === "put" ||
    config.method === "delete"
  ) {
    const originalData = config.data || {}; // preserve original body data

    config.data = {
      data: originalData,
      timestamp: Date.now(),
    };
  }

  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;

    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];

          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        if (data.message === "Access token has expired") {
          // Xử lí refresh token
        }
        break;

      case 403:
        toast.error("You are not allowed to do that!");
        break;
      case 500:
        toast.error("500 Error");
        break;
      default:
        break;
    }

    return Promise.reject(error.response);
  }
);

const requests = {
  get: <T>(url: string, params?: URLSearchParams): Promise<T> =>
    axios
      .get<ApiResponse<T>>(url, {
        params,
        headers: {
          "Content-type": "application/json",
        },
      })
      .then(responseBody),
  post: async <T>(url: string, body?: object): Promise<T> => {
    return axios
      .post<ApiResponse<T>>(url, body, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then(responseBody);
  },
  put: async <T>(url: string, body?: object): Promise<T> => {
    return axios
      .put<ApiResponse<T>>(url, body, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then(responseBody);
  },
  del: async <T>(url: string, params?: URLSearchParams): Promise<T> => {
    return axios
      .delete<ApiResponse<T>>(url, {
        params,
        headers: {
          "Content-type": "application/json",
        },
      })
      .then(responseBody);
  },
  postFile: async <T>(url: string, data?: FormData): Promise<T> => {
    return axios
      .post<ApiResponse<T>>(url, data, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then(responseBody);
  },
  putFile: async <T>(url: string, data?: FormData): Promise<T> => {
    return axios
      .put<ApiResponse<T>>(url, data, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then(responseBody);
  },
};

const Account = {
  login: (values: object) =>
    requests.post<LoginResponse>(
      META.BACKEND + "/api/Auth/signin-google",
      values
    ),
};

const Test = {
  test: (value: object) =>
    requests.post(META.BACKEND + "/api/Email/test", value),
};

const agent = {
  Test,
  Account,
};

export default agent;
