import axios from "axios";

const API_URL = "http://localhost:8080/api/todos";

export const getTodos = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/`, { params });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

export const createTodo = async (todoData) => {
  try {
    const response = await axios.post(`${API_URL}/`, todoData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
};


export const updateTodo = async (id, todoData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, todoData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};