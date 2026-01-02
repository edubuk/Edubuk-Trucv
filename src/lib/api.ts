
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
// Create main axios instance used everywhere
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,// 🔥 send cookies with every request
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}


const handlerLogout = async () => {
    try {
      const logoutData = await fetch(`${API_BASE_URL}/user/logout`,{
        method:"PUT",
        credentials: "include"
      })
      const logoutResult = await logoutData.json();
      console.log("logoutResult",logoutResult);
      if(!logoutResult.success){
        //toast.error("Your session is expired. Please relogin")
      }
        } catch (error) {
            console.error("Logout failed:", error);
        }
  };


api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => Promise.reject(error)
);


let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

// Separate axios instance for refresh call (no interceptors to avoid loops)
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const processQueue = (error: unknown, result?: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(result);
    }
  });
  failedQueue = [];
};


api.interceptors.response.use(
  (response) => {
    return response;
  },
  async(error) => {
    const originalRequest = error.config as RetryableRequestConfig ;
    const status = error.response?.status || 0;
    const isAuthError = status === 401;
    console.log("error response",error.response)
    if(error.response?.status===429){
      toast.error(error.response.data.message || "Too many requests. Please try again later.")
    }
    if(error.response?.status===400){
      toast.error(error.response.data.message || "Bad request. Please check your input.")
    }
    const isRefreshEndpoint =
      originalRequest?.url?.includes("/user/refresh-token") ?? false;

    if (isAuthError && !originalRequest._retry && !isRefreshEndpoint) {
      originalRequest._retry = true;

          if (isRefreshing) {
        // If a refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              // Once refresh is done, retry the original request
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
    
      return new Promise(async (resolve, reject) => {
        try {
          await refreshClient.post("/user/refresh-token");
          processQueue(null);
          resolve(api(originalRequest));
        } catch (refreshError) {
          processQueue(refreshError, null);
          handlerLogout();
          reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  }
);

export default api;