import api from "./api";
import { ENDPOINTS } from "@/constants";
export async function crearConsulta(consulta) {
  try {
    let response = await api.post(ENDPOINTS.CONSULTAS.CREAR_CONSULTA, consulta);
    if (response.status !== 201) {
      alert("Error al crear la consulta");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al crear la consulta:", error);
    throw error;
  }
}
export async function obtenerConsulta(id) {
  try {
    let response = await api.get(ENDPOINTS.CONSULTAS.OBTENER_CONSULTA(id));
    if (response.status !== 200) {
      alert("Error al obtener la consulta");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al obtener la consulta:", error);
    throw error;
  }
}
export async function obtenerConsultasUsuario(id) {
  try {
    let response = await api.get(ENDPOINTS.CONSULTAS.OBTENER_CONSULTAS_USUARIO(id));
    if (response.status !== 200) {
      alert("Error al obtener las consultas del paciente");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al obtener las consultas del paciente:", error);
    throw error;
  }
}
export async function responderConsulta(id, respuesta) {
  try {
    let response = await api.put(ENDPOINTS.CONSULTAS.RESPONDER_CONSULTA(id), respuesta);
    if (response.status !== 200) {
      alert("Error al responder la consulta");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al responder la consulta:", error);
    throw error;
  }
}