import { Api } from "./ApiClass";
import axios from "axios";
import { BASE_PATH } from "./constants";
import { placeTokenIntoRequests } from "@/api/interceptors";
import { getLocalStorageJWT } from "@/api/local-storage";
const axiosInstance = axios.create({ baseURL: BASE_PATH });
placeTokenIntoRequests(
  axiosInstance,
  getLocalStorageJWT,
  "Authorization",
  "Bearer "
);
export const api = new Api(axiosInstance);
