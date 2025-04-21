// stores/userStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    id: "6806775acd30891a73f1e1c6",
    usuario: null,
    tipo: "ESPECIALISTA",
    urlApi: "http://localhost:8080/salud/api/"
  }),
  actions: {
    getId() {
      return this.id
    },
    setId(id) {
      this.id = id
    },
    getUsuario() {
      return this.usuario
    },
    setUsuario(usuario) {
      this.usuario = usuario
    },
    getTipo() {
      return this.tipo
    },
    setTipo(tipo) {
      this.tipo = tipo
    },
    getUrlApi() {
      return this.urlApi
    },
    async loadUsuario() {
      let url
      switch (this.tipo) {
        case 'PACIENTE':
          url = "usuarios/pacientes/"
          break
        case 'MEDICO':
          url = "usuarios/medicos/"
          break
        case 'ESPECIALISTA':
          url = "usuarios/especialistas/"
          break
      }
      let response = await axios.get(this.urlApi + url + this.id)
      if (response.status != 200) {
        console.log("Error al cargar el usuario")
        return
      }
      this.usuario = response.data
    }
  },
  persist: true
})
