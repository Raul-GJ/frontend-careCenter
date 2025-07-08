import api from "./api";
import { ENDPOINTS } from "@/constants";

// Obtener usuario
export async function obtenerUsuario(id) {
  try {
    const response = await api.get(ENDPOINTS.USUARIOS.OBTENER_USUARIO(id));
    if (response.status !== 200) {
      alert("Error al obtener el usuario");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
}

// Obtener usuario por correo
export async function obtenerUsuarioPorCorreo(correo) {
  try {
    const response = await api.get(ENDPOINTS.USUARIOS.OBTENER_USUARIO_POR_CORREO(correo));
    if (response.status !== 200) {
      alert("Error al obtener el usuario");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
}

// Modificar usuario
export async function modificarUsuario(id, tipo, usuario) {
  try {
    const response = await api.patch(ENDPOINTS.USUARIOS.MODIFICAR_USUARIO(id, tipo), usuario);
    if (response.status !== 204) {
      alert("Error al modificar el usuario");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al modificar el usuario:", error);
    throw error;
  }
}

// Eliminar usuario
export async function eliminarUsuario(id) {
  try {
    const response = await api.delete(ENDPOINTS.USUARIOS.ELIMINAR_USUARIO(id));
    if (response.status !== 204) {
      alert("Error al eliminar el usuario");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
}

// Pacientes: agregar seguimientos
export async function agregarSeguimientosPaciente(id, seguimientos) {
  try {
    const response = await api.post(ENDPOINTS.USUARIOS.PACIENTES.AGREGAR_SEGUIMIENTOS(id), seguimientos);
    if (response.status !== 204) {
      alert("Error al agregar seguimientos al paciente");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al agregar seguimientos al paciente:", error);
    throw error;
  }
}

// Pacientes: eliminar seguimiento
export async function eliminarSeguimientoPaciente(id, seguimientoId) {
  try {
    const response = await api.delete(ENDPOINTS.USUARIOS.PACIENTES.ELIMINAR_SEGUIMIENTO(id, seguimientoId));
    if (response.status !== 204) {
      alert("Error al eliminar el seguimiento del paciente");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al eliminar el seguimiento del paciente:", error);
    throw error;
  }
}

// Médicos: agregar pacientes
export async function agregarPacientesMedico(id, pacientes) {
  try {
    const response = await api.post(ENDPOINTS.USUARIOS.MEDICOS.AGREGAR_PACIENTES(id), pacientes);
    if (response.status !== 200) {
      alert("Error al agregar pacientes al médico");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al agregar pacientes al médico:", error);
    throw error;
  }
}

// Médicos: eliminar paciente
export async function eliminarPacienteMedico(id, pacienteId) {
  try {
    const response = await api.delete(ENDPOINTS.USUARIOS.MEDICOS.ELIMINAR_PACIENTE(id, pacienteId));
    if (response.status !== 204) {
      alert("Error al eliminar el paciente del médico");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al eliminar el paciente del médico:", error);
    throw error;
  }
}

// Especialistas: agregar pacientes
export async function agregarPacientesEspecialista(id, pacientes) {
  try {
    const response = await api.post(ENDPOINTS.USUARIOS.ESPECIALISTAS.AGREGAR_PACIENTES(id), pacientes);
    if (response.status !== 200) {
      alert("Error al agregar pacientes al especialista");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al agregar pacientes al especialista:", error);
    throw error;
  }
}

// Especialistas: eliminar paciente
export async function eliminarPacienteEspecialista(id, pacienteId) {
  try {
    const response = await api.delete(ENDPOINTS.USUARIOS.ESPECIALISTAS.ELIMINAR_PACIENTE(id, pacienteId));
    if (response.status !== 204) {
      alert("Error al eliminar el paciente del especialista");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al eliminar el paciente del especialista:", error);
    throw error;
  }
}

// Especialistas: agregar plantillas
export async function agregarPlantillasEspecialista(id, plantillas) {
  try {
    const response = await api.post(ENDPOINTS.USUARIOS.ESPECIALISTAS.AGREGAR_PLANTILLAS(id), plantillas);
    if (response.status !== 200) {
      alert("Error al agregar plantillas al especialista");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al agregar plantillas al especialista:", error);
    throw error;
  }
}

// Especialistas: eliminar plantilla
export async function eliminarPlantillaEspecialista(id, plantillaId) {
  try {
    const response = await api.delete(ENDPOINTS.USUARIOS.ESPECIALISTAS.ELIMINAR_PLANTILLA(id, plantillaId));
    if (response.status !== 204) {
      alert("Error al eliminar la plantilla del especialista");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error al eliminar la plantilla del especialista:", error);
    throw error;
  }
}
