import { Api } from "./ApiClass";
import axios from "axios";
const axiosInstance = axios.create({ baseURL: "http://localhost:1337" });
export const api = new Api(axiosInstance);
