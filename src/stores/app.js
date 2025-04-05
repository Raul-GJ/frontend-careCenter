// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    usuario: null,
    urlApi: "http://localhost:8080/salud/api/"
  }),
  actions: {
    getUrlApi() {
      return this.urlApi
    },
    getUsuario() {
      return this.usuario
    },
    setUsuario(usr) {
      this.usuario = usr
    }
  },
})
