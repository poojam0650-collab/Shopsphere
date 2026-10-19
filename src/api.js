import axios from "axios";

const API = axios.create({
  baseURL: "https://6abdf380c4d5ac54830174ac.mockapi.io",
});

export default API;