import { defineStore } from 'pinia'
import axios from 'axios'
import { useUsuarioStore } from './usuarioStore'

export const useConsultaStore = defineStore('consultas', {
  state: () => ({
    /** @type {{ id: String, emisor: String, receptor: String, asunto: String, mensaje: String, fecha: Date, respuesta: String, fechaRespuesta: Date}[]} */
    consultas: [],
    isLoaded: false
  }),
  actions: {
    addConsulta(c) {
      this.consultas.push(c)
    },
    getConsulta(id) {
      return this.consultas.find(c => c.id == id)
    },
    responderConsulta(id, consulta) {
      let c = this.getConsulta(id)
      c.respuesta = consulta.respuesta
      c.fechaRespuesta = consulta.fechaRespuesta
    },
    deleteConsulta(id) {
      this.consultas = this.consultas.filter(c => c.id != id)
    },
    async loadConsultas() {
      if (this.isLoaded)
        return
      const usuarioStore = useUsuarioStore()
      let idUsuario = usuarioStore.getId()
      let tipoUsuario = usuarioStore.getTipo()
      let urlApi = usuarioStore.getUrlApi()
      try {
        let url
        switch (tipoUsuario) {
          case 'PACIENTE':
            url = "consultas/paciente/"
            break
          case 'MEDICO':
          case 'ESPECIALISTA':
            url = "consultas/sanitario/"
            break
          default:
            console.log('Tipo de usuario erroneo: ' + tipoUsuario)
            return
        }
        let response = await axios.get(urlApi + url + idUsuario)
        console.log(JSON.stringify(response.data))
        for (let consulta of response.data) {
          this.addConsulta(consulta)
        }
        this.isLoaded = true
      } catch (error) {
        console.error('Error cargando consultas: ', error)
      }
    },
    clearConsultas() {
      this.consultas = []
      this.isLoaded = false
    }
  },
})
