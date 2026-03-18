import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/todos",
});

export default api;