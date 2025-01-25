import axios from "axios";

let baseURL = "https://ebook-server-9sh3.onrender.com";
if (import.meta.env.MODE === "development") {
  baseURL = "http://localhost:8989";
}

const client = axios.create({
  baseURL,
});

client.interceptors.request.use(function (config) {
  config.withCredentials = true;

  return config;
});

export default client;
