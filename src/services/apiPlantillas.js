import api from "./api";
import { ENDPOINTS } from "@/constants";

export async function crearPlantilla(plantilla) {
  try {
    let response = await api.post(ENDPOINTS.PLANTILLAS.CREAR_PLANTILLA, plantilla);
    if (response.status !== 201) {
      alert("Error al crear la plantilla");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al crear la plantilla:", error);
    throw error;
  }
}
export async function obtenerPlantilla(id) {
  try {
    let response = await api.get(ENDPOINTS.PLANTILLAS.OBTENER_PLANTILLA(id));
    if (response.status !== 200) {
      alert("Error al obtener la plantilla");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al obtener la plantilla:", error);
    throw error;
  }
}
export async function modificarPlantilla(id, plantilla) {
  try {
    let response = await api.put(ENDPOINTS.PLANTILLAS.MODIFICAR_PLANTILLA(id), plantilla);
    if (response.status !== 200) {
      alert("Error al modificar la plantilla");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al modificar la plantilla:", error);
    throw error;
  }
}
export async function eliminarPlantilla(id) {
  try {
    let response = await api.delete(ENDPOINTS.PLANTILLAS.ELIMINAR_PLANTILLA(id));
    if (response.status !== 204) {
      alert("Error al eliminar la plantilla");
      return null;
    }
    return true;
  } catch (error) {
    console.error("Error al eliminar la plantilla:", error);
    throw error;
  }
}
export async function agregarPregunta(id, pregunta) {
  try {
    let response = await api.post(ENDPOINTS.PLANTILLAS.AGREGAR_PREGUNTA(id), pregunta);
    if (response.status !== 200) {
      alert("Error al agregar la pregunta a la plantilla");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al agregar la pregunta a la plantilla:", error);
    throw error;
  }
}
export async function eliminarPregunta(idPlantilla, idPregunta) {
  try {
    let response = await api.delete(ENDPOINTS.PLANTILLAS.ELIMINAR_PREGUNTA(idPlantilla, idPregunta));
    if (response.status !== 204) {
      alert("Error al eliminar la pregunta de la plantilla");
      return null;
    }
    return true;
  } catch (error) {
    console.error("Error al eliminar la pregunta de la plantilla:", error);
    throw error;
  }
}