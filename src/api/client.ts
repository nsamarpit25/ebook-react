import axios from "axios";

let baseURL = "https://ebook-server-9sh3.onrender.com";
if (import.meta.env.MODE === "development") {
  baseURL = "http://localhost:8000";
}

const client = axios.create({
  baseURL,
  withCredentials: true,
});

client.interceptors.request.use(function (config) {
  config.withCredentials = true;

  return config;
});

export default client;
