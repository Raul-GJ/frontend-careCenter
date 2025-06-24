import api from "./api";
import { ENDPOINTS } from "@/constants";

export async function crearNota(nota) {
  try {
    let response = await api.post(
      ENDPOINTS.USUARIOS.PACIENTES.NOTAS.AGREGAR_NOTAS(nota.pacienteId), nota);
    if (response.status !== 201) {
      alert("Error al crear la nota");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al crear la nota:", error);
    throw error;
  }
}

export async function obtenerNota(notaId) {
  try {
    let response = await api.get(ENDPOINTS.USUARIOS.PACIENTES.NOTAS.OBTENER_NOTA(notaId));
    if (response.status !== 200) {
      alert("Error al obtener la nota");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al obtener la nota:", error);
    throw error;
  }
}

export async function modificarNota(notaId, nota) {
  try {
    let response = await api.patch(ENDPOINTS.USUARIOS.PACIENTES.NOTAS.MODIFICAR_NOTA(notaId), nota);
    if (response.status !== 204) {
      alert("Error al modificar la nota");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al modificar la nota:", error);
    throw error;
  }
}

export async function eliminarNota(pacienteId, notaId) {
  try {
    let response = await api.delete(
      ENDPOINTS.USUARIOS.PACIENTES.NOTAS.ELIMINAR_NOTA(pacienteId, notaId));
    if (response.status !== 204) {
      alert("Error al eliminar la nota");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al eliminar la nota:", error);
    throw error;
  }
}