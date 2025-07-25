import { defineStore } from 'pinia'
import { agregarAlertasEstudio, agregarPacientesEstudio, crearEstudio, modificarEstudio, obtenerEstudio , agregarSeguimientosEstudio} from '@/services/apiEstudios'
import { useAsignacionEstudioStore } from './asignacionEstudioStore'
import { useSesionStore } from './sesionStore'
import { useUsuarioStore } from './usuarioStore'

/**
 * @typedef {Object} Estudio
 * @property {String} id
 * @property {String} nombre
 * @property {String} descripcion
 * @property {Date} fechaAlta
 * @property {Date} fechaFin
 * @property {Array} pacientes
 * @property {Array} seguimientos
 * @property {Array} alertas
 * @property {String} rol // Por facilidad se añade el rol del propio usuario
 * @property {Array} especialistas // Por facilidad se añade los especialistas del estudio jutno a su rol
 */

export const useEstudioStore = defineStore('estudios', {
  state: () => ({
    /** @type {Estudio[]} */
    estudios: [],
    isLoaded: false
  }),
  actions: {
    async addEstudio(estudio) {
      const index = this.estudios.findIndex(e => e.id == estudio.id)
      if (index === -1) {
        this.estudios.push(estudio)
      } else {
        await this.setEstudio(estudio.id, estudio)
      }
    },
    async getEstudio(id, force = false) {
      let estudio = this.estudios.find(e => e.id == id)
      if (!estudio || force) {
        try {
          let response = await obtenerEstudio(id)
          this.addEstudio(response.data)
          estudio = response.data
        } catch (error) {
          console.error('Error obteniendo estudio:', error)
          throw error
        }
      }
      return estudio
    },
    async setEstudio(id, estudio) {
      try {
        await modificarEstudio(id, estudio)
      } catch (error) {
        console.error('Error modificando estudio:', error)
        throw error
      }
      const index = this.estudios.findIndex(e => e.id == id)
      if (index !== -1) {
        this.estudios[index] = { ...this.estudios[index], ...estudio, id }
      }
    },
    deleteEstudio(id) {
      this.estudios = this.estudios.filter(e => e.id != id)
    },
    async loadEstudios(force = false) {
      if (this.isLoaded && !force) return
      this.clearEstudios()
      const sesionStore = useSesionStore()
      const usuarioStore = useUsuarioStore()
      const usuario = await sesionStore.getUsuario()
      const asignacionStore = useAsignacionEstudioStore()
      try {
        // Cargar tus estudios
        await asignacionStore.loadAsignacionesEspecialista()
        let asignacionesEspecialista = asignacionStore.getAsignacionesPorEspecialista(usuario.id)
        for (let asignacion of asignacionesEspecialista) {
          let response = await obtenerEstudio(asignacion.estudio)
          let newEstudio = response.data
          newEstudio.rol = asignacion.rol
          this.addEstudio(newEstudio)
        }

        // Cargar los especialistas de tus estudios
        for (let estudio of this.estudios) {
          estudio.especialistas = []
          await asignacionStore.loadAsignacionesEstudio(estudio.id)
          let asignacionesEstudio = asignacionStore.getAsignacionesPorEstudio(estudio.id)
          for (let asignacion of asignacionesEstudio) {
            console.log(asignacion)
            let especialista = await usuarioStore.getUsuario(asignacion.especialista)
            let newEspecialista = especialista
            newEspecialista.rol = asignacion.rol
            estudio.especialistas.push(newEspecialista)
          }
        }
      } catch (error) {
        console.error('Error cargando estudios: ', error)
        throw error
      }
      this.isLoaded = true
    },
    clearEstudios() {
      this.estudios = []
      this.isLoaded = false
    },
    async crearEstudio(nuevoEstudio) {
      try {
        console.log("Store - Creando estudio:", nuevoEstudio)
        const response = await crearEstudio(nuevoEstudio)
        console.log("Store - Respuesta recibida:", response)
        
        if (!response) {
          console.error("Store - No se recibió respuesta")
          throw new Error('No se recibió respuesta del servidor')
        }
        
        if (response.status !== 201) {
          console.error("Store - Status incorrecto:", response.status)
          throw new Error(`Error al crear el estudio. Status: ${response.status}`)
        }
        
        console.log("Store - Estudio creado exitosamente")
        return response
      } catch (error) {
        console.error('Store - Error creando estudio:', error)
        console.error('Store - Stack trace:', error.stack)
        throw error
      }
    },
    async agregarPacientes(idEstudio, pacientes) {
      try {
        const response = await agregarPacientesEstudio(idEstudio, pacientes)
        if (!response || response.status !== 204) {
          throw new Error('Error al agregar pacientes al estudio')
        }
        return response
      } catch (error) {
        console.error('Error agregando pacientes al estudio:', error)
        throw error
      }
    },
    async agregarAlertas(idEstudio, alertas) {
      try {
        const response = await agregarAlertasEstudio(idEstudio, alertas)
        if (!response || response.status !== 204) {
          throw new Error('Error al agregar alertas al estudio')
        }
        return response
      } catch (error) {
        console.error('Error agregando alertas al estudio:', error)
        throw error
      }
    },
    async agregarSeguimientos(idEstudio, seguimientos) {
      try {
        const response = await agregarSeguimientosEstudio(idEstudio, seguimientos)
        if (!response || response.status !== 204) {
          throw new Error('Error al agregar seguimientos al estudio')
        }
        return response
      } catch (error) {
        console.error('Error agregando seguimientos al estudio:', error)
        throw error
      }
    }
  }
})