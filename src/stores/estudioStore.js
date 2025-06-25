import { defineStore } from 'pinia'
import { obtenerEstudio } from '@/services/apiEstudios'
import { useAsignacionEstudioStore } from './asignacionEstudioStore'
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
  }),
  actions: {
    addEstudio(estudio) {
      const index = this.estudios.findIndex(e => e.id == estudio.id)
      if (index === -1) {
        this.estudios.push(estudio)
      } else {
        this.estudios[index] = { ...this.estudios[index], ...estudio }
      }
    },
    async getEstudio(id) {
      let estudio = this.estudios.find(e => e.id == id)
      if (!estudio) {
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
    setEstudio(id, estudio) {
      const index = this.estudios.findIndex(e => e.id == id)
      if (index !== -1) {
        this.estudios[index] = { ...this.estudios[index], ...estudio, id }
      }
    },
    deleteEstudio(id) {
      this.estudios = this.estudios.filter(e => e.id != id)
    },
    async loadEstudios(force = false) {
      if (this.estudios.length > 0 && !force) return
      this.clearEstudios()
      const usuarioStore = useUsuarioStore()
      const asignacionStore = useAsignacionEstudioStore()
      const usuario = await usuarioStore.getUsuario()
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
          let asignacionesEstudio = asignacionStore.getAsignacionesPorEstudio(estudio.id)
          for (let asignacion of asignacionesEstudio) {
            let response2 = await usuarioStore.getUsuario(asignacion.especialista)
            let newEspecialista = response2.data
            newEspecialista.rol = asignacion.rol
            estudio.especialistas.push(newEspecialista)
          }
        }
      } catch (error) {
        console.error('Error cargando estudios: ', error)
        throw error
      }
    },
    clearEstudios() {
      this.estudios = []
    }
  }
})
