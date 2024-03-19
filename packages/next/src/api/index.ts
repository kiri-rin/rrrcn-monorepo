import { Api } from "./ApiClass";
import axios from "axios";
import { API_BASE_PATH } from "./constants";
import { placeTokenIntoRequests } from "./interceptors";
import { getLocalStorageJWT } from "./local-storage";
const axiosInstance = axios.create({ baseURL: API_BASE_PATH });
// placeTokenIntoRequests(
//   axiosInstance,
//   getLocalStorageJWT,
//   "Authorization",
//   "Bearer "
// );
export const api = new Api(axiosInstance);
