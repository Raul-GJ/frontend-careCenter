import api from "./api";
import { ENDPOINTS } from "@/constants";

export async function crearAlerta(alerta) {
  try {
    let response = await api.post(ENDPOINTS.ALERTAS.CREAR_ALERTA, alerta);
    if (response.status !== 201) {
      alert("Error al crear la alerta");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al crear la alerta:", error);
    throw error;
  }
}

export async function obtenerAlerta(id) {
  try {
    let response = await api.get(ENDPOINTS.ALERTAS.OBTENER_ALERTA(id));
    if (response.status !== 200) {
      alert("Error al obtener la alerta");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al obtener la alerta:", error);
    throw error;
  }
}

export async function modificarAlerta(id, alerta) {
  try {
    let response = await api.put(ENDPOINTS.ALERTAS.MODIFICAR_ALERTA(id), alerta);
    if (response.status !== 200) {
      alert("Error al modificar la alerta");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al modificar la alerta:", error);
    throw error;
  }
}

export async function eliminarAlerta(id) {
  try {
    let response = await api.delete(ENDPOINTS.ALERTAS.ELIMINAR_ALERTA(id));
    if (response.status !== 204) {
      alert("Error al eliminar la alerta");
      return null;
    }
    return true;
  } catch (error) {
    console.error("Error al eliminar la alerta:", error);
    throw error;
  }
}