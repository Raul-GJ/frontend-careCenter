import api from "./api";
import { ENDPOINTS } from "@/constants";
export async function crearAsignacion(asignacion) {
  try {
    let response = await api.post(ENDPOINTS.ASIGNACIONES.CREAR_ASIGNACION, asignacion);
    if (response.status !== 201) {
      alert("Error al crear la asignación");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al crear la asignación:", error);
    throw error;
  }
}
export async function obtenerAsignacion(id) {
  try {
    let response = await api.get(ENDPOINTS.ASIGNACIONES.OBTENER_ASIGNACION(id));
    if (response.status !== 200) {
      alert("Error al obtener la asignación");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al obtener la asignación:", error);
    throw error;
  }
}
export async function obtenerAsignacionesPorEspecialista(id) {
  try {
    let response = await api.get(ENDPOINTS.ASIGNACIONES.OBTENER_ASIGNACIONES_POR_ESPECIALISTA(id));
    if (response.status !== 200) {
      alert("Error al obtener los especialistas de la asignación");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al obtener los especialistas de la asignación:", error);
    throw error;
  }
}
export async function obtenerAsignacionesPorEstudio(id) {
  try {
    let response = await api.get(ENDPOINTS.ASIGNACIONES.OBTENER_ASIGNACIONES_POR_ESTUDIO(id));
    if (response.status !== 200) {
      alert("Error al obtener los estudios de la asignación");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al obtener los estudios de la asignación:", error);
    throw error;
  }
}
export async function modificarAsignacion(id, asignacion) {
  try {
    let response = await api.put(ENDPOINTS.ASIGNACIONES.MODIFICAR_ASIGNACION(id), asignacion);
    if (response.status !== 200) {
      alert("Error al modificar la asignación");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al modificar la asignación:", error);
    throw error;
  }
}
export async function eliminarAsignacion(id) {
  try {
    let response = await api.delete(ENDPOINTS.ASIGNACIONES.ELIMINAR_ASIGNACION(id));
    if (response.status !== 204) {
      alert("Error al eliminar la asignación");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al eliminar la asignación:", error);
    throw error;
  }
}
