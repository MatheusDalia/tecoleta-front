import axios from "axios";
import { Platform } from "react-native";
//http://localhost:3000/api
const api = axios.create({
  baseURL:
    Platform.OS === "web"
      ? "https://tecoleta.tecomat.com.br/api"
      : "https://tecoleta.tecomat.com.br/api", // Verifique se este é o IP correto do seu backend
  timeout: 10000,
});

// Adicionar interceptor para debug
api.interceptors.request.use((request) => {
  console.log("Requisição:", {
    url: request.url,
    method: request.method,
    baseURL: request.baseURL,
  });
  return request;
});

api.interceptors.response.use(
  (response) => {
    console.log("Resposta:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("Erro na requisição:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

export default api;
