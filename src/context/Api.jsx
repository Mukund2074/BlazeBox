import axios from "axios";

let apikey1 = process.env.NEXT_PUBLIC_APIKEY1;
let apikey2 = process.env.NEXT_PUBLIC_APIKEY2;
let apikey3 = process.env.NEXT_PUBLIC_APIKEY3;
let apikey4 = process.env.NEXT_PUBLIC_APIKEY4;
let apikey5 = process.env.NEXT_PUBLIC_APIKEY5;
let apikey6 = process.env.NEXT_PUBLIC_APIKEY6;
let host = process.env.NEXT_PUBLIC_APIHOST;

const apiKeys = [apikey1, apikey2, apikey4, apikey4, apikey5, apikey6];
let currentApiKeyIndex = 0;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APIURL,
  headers: {
    'X-RapidAPI-Key': apiKeys[currentApiKeyIndex],
    'X-RapidAPI-Host': host,
  },
});

api.interceptors.request.use((config) => {
  config.headers['X-RapidAPI-Key'] = apiKeys[currentApiKeyIndex];
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 429 || error.response.data.code === 429) {
      currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
      error.config.headers['X-RapidAPI-Key'] = apiKeys[currentApiKeyIndex];
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
