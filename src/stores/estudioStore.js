import { defineStore } from 'pinia'
import { obtenerAsignacionesPorEspecialista, obtenerAsignacionesPorEstudio } from '@/services/apiAsignaciones'
import { obtenerEstudio } from '@/services/apiEstudios'
import { obtenerUsuario } from '@/services/apiUsuarios'
import { useUsuarioStore } from './usuarioStore'

export const useEstudioStore = defineStore('estudios', {
  state: () => ({
    /** @type {{ id: String, nombre: String, descripcion: String, fechaAlta: Date, fechaFin: Date, pacientes: Array, seguimientos: Array, alertas: Array, rol: String, especialistas: Array}[]} */
    estudios: [],
    isLoaded: false
  }),
  actions: {
    addEstudio(e) {
      this.estudios.push(e)
    },
    getEstudio(id) {
      return this.estudios.find(e => e.id == id)
    },
    setEstudio(id, estudio) {
      let e = this.getEstudio(id)
      e.nombre = estudio.nombre
      e.descripcion = estudio.descripcion
      e.fechaFin = estudio.fechaFin
    },
    deleteEstudio(id) {
      this.estudios = this.estudios.filter(e => e.id != id)
    },
    async loadEstudios() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let idUsuario = usuarioStore.getId()
      try {
        // Cargar tus estudios
        console.log('Cargando estudios')
        let response = await obtenerAsignacionesPorEspecialista(idUsuario)
        console.log(JSON.stringify(response.data))
        for (let asignacion of response.data) {
          console.log(JSON.stringify(asignacion))
          let response2 = await obtenerEstudio("estudios/" + asignacion.estudio)
          let newEstudio = response2.data
          newEstudio.rol = asignacion.rol
          this.addEstudio(newEstudio)
        }

        // Cargar los especialistas de tus estudios
        console.log('Cargando especialistas de los estudios')
        for (let estudio of this.estudios) {
          let responseEspecialistas = await obtenerAsignacionesPorEstudio(estudio.id)
          console.log(JSON.stringify(responseEspecialistas.data))
          for (let asignacion of responseEspecialistas.data) {
            console.log(JSON.stringify(asignacion))
            let response2 = await obtenerUsuario(asignacion.especialista)
            let newEspecialista = response2.data
            newEspecialista.rol = asignacion.rol
            estudio.especialistas = []
            estudio.especialistas.push(newEspecialista)
          }
        }

        this.isLoaded = true
      } catch (error) {
        console.error('Error cargando estudios: ', error)
      }
    },
    clearEstudios() {
      this.estudios = []
      this.isLoaded = false
    }
  },
})
