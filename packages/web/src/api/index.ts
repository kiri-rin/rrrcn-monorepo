import { Api } from "./ApiClass";
import axios from "axios";
import { BASE_PATH } from "./constants";
const axiosInstance = axios.create({ baseURL: BASE_PATH });
export const api = new Api(axiosInstance);
