import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // useful if you’re dealing with cookies/sessions
  timeout: 10000, // optional: timeout after 10s
});

// Optional: Interceptors (for logging or auth)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error("Axios Error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
