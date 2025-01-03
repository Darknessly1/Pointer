// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth/';

export const login = async (credentials) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await axios.post(`${API_URL}login`, credentials);
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
    try {
        return await axios.post(`${API_URL}register`, userData);
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;  // Ensure you throw error to be caught in the frontend
    }
};
