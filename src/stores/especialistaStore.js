import { defineStore } from 'pinia'
import { obtenerUsuario } from '@/services/apiUsuarios'
import { useUsuarioStore } from './usuarioStore'

export const useEspecialistaStore = defineStore('especialistas', {
  state: () => ({
    /** @type {{ id: String, nombre: String, apellidos: String, email: String, telefono: String, fechaNacimiento: Date, sexo: String, direccion: String, dni: String, nCol: String, centroDeSalud: String, pacientes: Array, especialidad: String, infoEstudios: Array, plantillas: Array, consultas: Array}[]} */
    especialistas: [],
    isLoaded: false
  }),
  actions: {
    addEspecialista(e) {
      this.especialistas.push(e)
    },
    async getEspecialista(id) {
      const especialista = this.especialistas.find(e => e.id == id)
      if (!especialista) {
        try {
          // Cambia aquí: pasa el tipo correcto
          let response = await obtenerUsuario(id, 'especialistas')
          this.addEspecialista(response.data)
          return response.data
        } catch (error) {
          console.error('Error obteniendo especialista:', error)
          throw error
        }
      }
      return especialista
    },
    setEspecialista(id, especialista) {
      let e = this.getEspecialista(id)
      e.nombre = especialista.nombre
      e.apellidos = especialista.apellidos
      e.email = especialista.email
      e.telefono = especialista.telefono
      e.nCol = especialista.nCol
      e.espceialidad = especialista.espceialidad
      e.infoEstudios = especialista.infoEstudios
      e.plantillas = especialista.plantillas
      e.consultas = especialista.consultas
    },
    deleteEspecialista(id) {
      this.especialistas = this.especialistas.filter(e => e.id != id)
    },
    async loadEspecialistas() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let usuario = await usuarioStore.getUsuario()
      try {
        for (let idEspecialista of usuario.especialistas) {
          let response = await obtenerUsuario(idEspecialista, 'especialistas')
          console.log(JSON.stringify(response.data))
          this.addEspecialista(response.data)
        }
        this.isLoaded = true
      } catch (error) {
        console.error('Error cargando especialistas: ', error)
      }
    },
    clearEspecialistas() {
      this.especialistas = []
      this.isLoaded = false
    }
  },
})
