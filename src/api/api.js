import axios from "axios";
import qs from "qs";
const BASE_URL = "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// const protectedApi = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

api.interceptors.request.use((config) => {
  config.paramsSerializer = (params) => {
    return qs.stringify(params, {
      arrayFormat: "indices",
      encode: false,
    });
  };
  return config;
});

export { api };
