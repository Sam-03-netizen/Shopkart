import axios from "axios";

export const axiosInstance = axios.create({
    baseURL : 'http://localhost:8085/',
    withCredentials : true
})
