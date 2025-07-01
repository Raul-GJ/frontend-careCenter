import api from "./api";
import { ENDPOINTS } from "@/constants";

export async function login(correo, contrasenya) {
  try {
    let body = { correo, contrasenya }
    let response = await api.post(ENDPOINTS.AUTH.LOGIN, body)
    console.log("Response from API:", response.data);
    if (response.status != 200) {
      alert("Credenciales incorrectas")
      return null
    }
    // Comprobamos si el token y el id son válidos
    let { token, id } = response.data;
    console.log('ID de usuario devuelto:', id)
    if (id == null) {
      console.log('Error al iniciar sesión')
      return
    }
    console.log('Token recibido:', token)
    if (token == null) {
      console.log('Error al iniciar sesión: token no recibido')
      return
    }
    // Guardar token y expiración (1 día)
    localStorage.setItem('token', token)
    localStorage.setItem('token_expiry', (Date.now() + 24* 3600 * 1000).toString())
    return response
  } catch (error) {
    console.error("Error during API authentication:", error);
    throw error;
  }
}

export async function logout() {
  try {
    let token = localStorage.getItem('token')
    if (token) {
      await api.post(ENDPOINTS.AUTH.LOGOUT, {});
    }
  } catch (error) {
    console.error("Error during API logout:", error);
    throw error;
  }
}

export async function registro(rol, body) {
  
  try {
    let response = await api.post(ENDPOINTS.AUTH.REGISTRO(rol.toLowerCase()), body)
    if (response.status != 201) {
      alert("Error al registrar el usuario")
      return null;
    }
    alert("Usuario registrado correctamente")
    return response;
  } catch (error) {
    console.error("Error during API registration:", error);
    throw error;
  }
}