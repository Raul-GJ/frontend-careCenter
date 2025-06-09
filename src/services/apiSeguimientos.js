import api from "./api";
import { ENDPOINTS } from "@/constants";

// Crear un seguimiento
export async function crearSeguimiento(seguimiento) {
  try {
    const response = await api.post(ENDPOINTS.SEGUIMIENTOS.CREAR_SEGUIMIENTO, seguimiento);
    if (response.status !== 201) {
      alert("Error al crear el seguimiento");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al crear el seguimiento:", error);
    throw error;
  }
}

// Obtener un seguimiento
export async function obtenerSeguimiento(id) {
  try {
    const response = await api.get(ENDPOINTS.SEGUIMIENTOS.OBTENER_SEGUIMIENTO(id));
    if (response.status !== 200) {
      alert("Error al obtener el seguimiento");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al obtener el seguimiento:", error);
    throw error;
  }
}

// Modificar un seguimiento
export async function modificarSeguimiento(id, seguimiento) {
  try {
    const response = await api.put(ENDPOINTS.SEGUIMIENTOS.MODIFICAR_SEGUIMIENTO(id), seguimiento);
    if (response.status !== 200) {
      alert("Error al modificar el seguimiento");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al modificar el seguimiento:", error);
    throw error;
  }
}

// Eliminar un seguimiento
export async function eliminarSeguimiento(id) {
  try {
    const response = await api.delete(ENDPOINTS.SEGUIMIENTOS.ELIMINAR_SEGUIMIENTO(id));
    if (response.status !== 204) {
      alert("Error al eliminar el seguimiento");
      return null;
    }
    return true;
  } catch (error) {
    console.error("Error al eliminar el seguimiento:", error);
    throw error;
  }
}

// Rellenar formulario de seguimiento
export async function rellenarFormulario(id, datos) {
  try {
    const response = await api.post(ENDPOINTS.SEGUIMIENTOS.RELLENAR_FORMULARIO(id), datos);
    if (response.status !== 200) {
      alert("Error al rellenar el formulario del seguimiento");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al rellenar el formulario del seguimiento:", error);
    throw error;
  }
}
