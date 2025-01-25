import axios from "axios";

const client = axios.create({
  baseURL: "https://ebook-server-9sh3.onrender.com",
  // baseURL: "http://localhost:8000",
  // baseURL: "http://192.168.1.9:8000/",
  // withCredentials: true,
});

export default client;

client.interceptors.request.use(function (config) {
  config.withCredentials = true;
  return config;
});
