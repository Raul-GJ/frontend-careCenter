export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    LOGOUT: '/auth/logout/',
    REGISTRO: (rol) => `/auth/registro/${rol}/`,
  },
  USUARIOS: {
    OBTENER_USUARIO: (id) => `/usuarios/${id}/`,
    MODIFICAR_USUARIO: (id, tipo) => `/usuarios/${tipo}/${id}/`,
    ELIMINAR_USUARIO: (id) => `/usuarios/${id}/`,
    AGREGAR_ALERTAS: (id) => `/usuarios/${id}/alertas/`,
    ELIMINAR_ALERTA: (id, alertaId) => `/usuarios/${id}/alertas/${alertaId}/`,
    PACIENTES: {
      AGREGAR_SEGUIMIENTOS: (id) => `/usuarios/pacientes/${id}/seguimientos/`,
      ELIMINAR_SEGUIMIENTO: (id, seguimientoId) => `/usuarios/pacientes/${id}/seguimientos/${seguimientoId}/`,
      NOTAS: {
        AGREGAR_NOTAS: (id) => `/usuarios/pacientes/${id}/notas/`,
        OBTENER_NOTA: (notaId) => `/usuarios/pacientes/notas/${notaId}/`,
        MODIFICAR_NOTA: (notaId) => `/usuarios/pacientes/notas/${notaId}/`,
        ELIMINAR_NOTA: (id, notaId) => `/usuarios/pacientes/${id}/notas/${notaId}/`,
      }
    },
    MEDICOS: {
      AGREGAR_PACIENTES: (id) => `/usuarios/medicos/${id}/pacientes/`,
      ELIMINAR_PACIENTE: (id, pacienteId) => `/usuarios/medicos/${id}/pacientes/${pacienteId}/`,
    },
    ESPECIALISTAS: {
      AGREGAR_PACIENTES: (id) => `/usuarios/especialistas/${id}/pacientes/`,
      ELIMINAR_PACIENTE: (id, pacienteId) => `/usuarios/especialistas/${id}/pacientes/${pacienteId}/`,
      AGREGAR_PLANTILLAS: (id) => `/usuarios/especialistas/${id}/plantillas/`,
      ELIMINAR_PLANTILLA: (id, plantillaId) => `/usuarios/especialistas/${id}/plantillas/${plantillaId}/`,
    },
  },
  ALERTAS: {
    CREAR_ALERTA: '/alertas/',
    OBTENER_ALERTA: (id) => `/alertas/${id}/`,
    OBTENER_ALERTAS_USUARIO: (id) => `/alertas/usuario/${id}/`,
    ELIMINAR_ALERTA: (id) => `/alertas/${id}/`,
    LEER_ALERTA: (id) => `/alertas/${id}/leer/`,
  },
  ASIGNACIONES: {
    CREAR_ASIGNACION: '/asignaciones/',
    OBTENER_ASIGNACION: (id) => `/asignaciones/${id}/`,
    OBTENER_ASIGNACIONES_POR_ESPECIALISTA: (id) => `/asignaciones/estudios/${id}/`,
    OBTENER_ASIGNACIONES_POR_ESTUDIO: (id) => `/asignaciones/especialistas/${id}/`,
    MODIFICAR_ASIGNACION: (id) => `/asignaciones/${id}/`,
    ELIMINAR_ASIGNACION: (id) => `/asignaciones/${id}/`,
  },
  CONSULTAS: {
    CREAR_CONSULTA: '/consultas/',
    OBTENER_CONSULTA: (id) => `/consultas/${id}/`,
    OBTENER_CONSULTAS_USUARIO: (id) => `/consultas/usuario/${id}/`,
    RESPONDER_CONSULTA: (id) => `/consultas/${id}/`,
  },
  ESTUDIOS: {
    CREAR_ESTUDIO: '/estudios/',
    MODIFICAR_ESTUDIO: (id) => `/estudios/${id}/`,
    AGREGAR_PACIENTES: (id) => `/estudios/${id}/pacientes/`,
    AGREGAR_ESPECIALISTAS: (id) => `/estudios/${id}/especialistas/`,
    AGREGAR_ALERTAS: (id) => `/estudios/${id}/alertas/`,
    AGREGAR_SEGUIMIENTOS: (id) => `/estudios/${id}/seguimientos/`,
    ELIMINAR_PACIENTE: (id, pacienteId) => `/estudios/${id}/pacientes/${pacienteId}/`,
    ELIMINAR_ESPECIALISTA: (id, especialistaId) => `/estudios/${id}/especialistas/${especialistaId}/`,
    ELIMINAR_ALERTA: (id, alertaId) => `/estudios/${id}/alertas/${alertaId}/`,
    ELIMINAR_SEGUIMIENTO: (id, seguimientoId) => `/estudios/${id}/seguimientos/${seguimientoId}/`,
    OBTENER_ESTUDIO: (id) => `/estudios/${id}/`,
    ELIMINAR_ESTUDIO: (id) => `/estudios/${id}/`,
  },
  PLANTILLAS: {
    CREAR_PLANTILLA: '/plantillas/',
    OBTENER_PLANTILLA: (id) => `/plantillas/${id}/`,
    MODIFICAR_PLANTILLA: (id) => `/plantillas/${id}/`,
    ELIMINAR_PLANTILLA: (id) => `/plantillas/${id}/`,
    AGREGAR_PREGUNTA: (id, tipo) => `/plantillas/${id}/datos/${tipo}/`,
    ELIMINAR_PREGUNTA: (id, preguntaId) => `/plantillas/${id}/datos/${preguntaId}/`,
  },
  SEGUIMIENTOS: {
    CREAR_SEGUIMIENTO: '/seguimientos/',
    OBTENER_SEGUIMIENTO: (id) => `/seguimientos/${id}/`,
    MODIFICAR_SEGUIMIENTO: (id) => `/seguimientos/${id}/`,
    ELIMINAR_SEGUIMIENTO: (id) => `/seguimientos/${id}/`,
    RELLENAR_FORMULARIO: (id) => `/seguimientos/${id}/formulario/`,
  }
};