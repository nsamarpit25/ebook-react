import axios from "axios";
import Cookies from "js-cookie";

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
  // console.log(document.cookie);

  config.headers.token = Cookies.get("authToken");
  // console.log(config.headers);

  // config.body.tokennn = Cookies.get("authToken");

  return config;
});

export default client;
