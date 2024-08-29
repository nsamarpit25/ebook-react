import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8000",
  // withCredentials: true,
});

export default client;

client.interceptors.request.use(function (config) {
  config.withCredentials = true;
  return config;
});
