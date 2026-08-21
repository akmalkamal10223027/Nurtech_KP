import axios, { AxiosInstance } from "axios";
import errorHandler from "./error";
import { configs } from "@/lib/constants";

const createAxiosInstance = (
  baseURL: string = configs.API_BASE,
): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      apiKey: configs.API_KEY,
    },
  });

  applyInterceptor(instance);
  return instance;
};

const applyInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(async (request) => {
    // NOTE if u need put something, put it right here
    request.headers["Authorization"] = `Bearer ${configs.TOKEN}`;
    return request;
  });
  axiosInstance.interceptors.response.use((response) => response, errorHandler);
};

export const Base = createAxiosInstance();
// export const File = createAxiosInstance(configs.API_FILE); NOTE if need more api do it like this
