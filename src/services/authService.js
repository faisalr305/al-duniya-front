
import api from './api'

async function getCurrentUser(){
    const response = await api.get("/auth/me");
    return response.data;
}

function logout(){
    localStorage.removeItem("token");
}

export {
  getCurrentUser,
  logout
};
