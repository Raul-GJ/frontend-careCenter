import api from "./api";
import { ENDPOINTS } from "@/constants";

export async function crearEstudio(estudio) {
  try {
    let response = await api.post(ENDPOINTS.ESTUDIOS.CREAR_ESTUDIO, estudio);
    if (response.status !== 201) {
      alert("Error al crear el estudio");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al crear el estudio:", error);
    throw error;
  }
}
export async function obtenerEstudio(id) {
  try {
    let response = await api.get(ENDPOINTS.ESTUDIOS.OBTENER_ESTUDIO(id));
    if (response.status !== 200) {
      alert("Error al obtener el estudio");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al obtener el estudio:", error);
    throw error;
  }
}
export async function modificarEstudio(id, estudio) {
  try {
    let response = await api.put(ENDPOINTS.ESTUDIOS.MODIFICAR_ESTUDIO(id), estudio);
    if (response.status !== 200) {
      alert("Error al modificar el estudio");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al modificar el estudio:", error);
    throw error;
  }
}
export async function eliminarEstudio(id) {
  try {
    let response = await api.delete(ENDPOINTS.ESTUDIOS.ELIMINAR_ESTUDIO(id));
    if (response.status !== 204) {
      alert("Error al eliminar el estudio");
      return null;
    }
    return true;
  } catch (error) {
    console.error("Error al eliminar el estudio:", error);
    throw error;
  }
}
export async function agregarPacientesEstudio(id, pacientes) {
  try {
    let response = await api.post(ENDPOINTS.ESTUDIOS.AGREGAR_PACIENTES(id), pacientes);
    if (response.status !== 200) {
      alert("Error al agregar pacientes al estudio");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al agregar pacientes al estudio:", error);
    throw error;
  }
}
export async function eliminarPacienteEstudio(idEstudio, idPaciente) {
  try {
    let response = await api.delete(ENDPOINTS.ESTUDIOS.ELIMINAR_PACIENTE(idEstudio, idPaciente));
    if (response.status !== 204) {
      alert("Error al eliminar el paciente del estudio");
      return null;
    }
    return true;
  } catch (error) {
    console.error("Error al eliminar el paciente del estudio:", error);
    throw error;
  }
}
export async function agregarEspecialistasEstudio(id, especialistas) {
  try {
    let response = await api.post(ENDPOINTS.ESTUDIOS.AGREGAR_ESPECIALISTAS(id), especialistas);
    if (response.status !== 200) {
      alert("Error al agregar especialistas al estudio");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al agregar especialistas al estudio:", error);
    throw error;
  }
}
export async function eliminarEspecialistaEstudio(idEstudio, idEspecialista) {
  try {
    let response = await api.delete(ENDPOINTS.ESTUDIOS.ELIMINAR_ESPECIALISTA(idEstudio, idEspecialista));
    if (response.status !== 204) {
      alert("Error al eliminar el especialista del estudio");
      return null;
    }
    return true;
  } catch (error) {
    console.error("Error al eliminar el especialista del estudio:", error);
    throw error;
  }
}
export async function agregarAlertasEstudio(id, alertas) {
  try {
    let response = await api.post(ENDPOINTS.ESTUDIOS.AGREGAR_ALERTAS(id), alertas);
    if (response.status !== 200) {
      alert("Error al agregar alertas al estudio");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al agregar alertas al estudio:", error);
    throw error;
  }
}
export async function eliminarAlertaEstudio(idEstudio, idAlerta) {
  try {
    let response = await api.delete(ENDPOINTS.ESTUDIOS.ELIMINAR_ALERTA(idEstudio, idAlerta));
    if (response.status !== 204) {
      alert("Error al eliminar la alerta del estudio");
      return null;
    }
    return true;
  } catch (error) {
    console.error("Error al eliminar la alerta del estudio:", error);
    throw error;
  }
}
export async function agregarSeguiminetosEstudio(id, seguimientos) {
  try {
    let response = await api.post(ENDPOINTS.ESTUDIOS.AGREGAR_SEGUIMIENTOS(id), seguimientos);
    if (response.status !== 200) {
      alert("Error al agregar seguimientos al estudio");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error al agregar seguimientos al estudio:", error);
    throw error;
  }
}
export async function eliminarSeguimientoEstudio(idEstudio, idSeguimiento) {
  try {
    let response = await api.delete(ENDPOINTS.ESTUDIOS.ELIMINAR_SEGUIMIENTO(idEstudio, idSeguimiento));
    if (response.status !== 204) {
      alert("Error al eliminar el seguimiento del estudio");
      return null;
    }
    return true;
  } catch (error) {
    console.error("Error al eliminar el seguimiento del estudio:", error);
    throw error;
  }
}