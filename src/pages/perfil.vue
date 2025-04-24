<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useUsuarioStore } from '@/stores/usuarioStore'

  const headers = {
    headers: {
      "Content-Type": "application/json"
    }
  }
  
  const usuarioStore = useUsuarioStore()

  const idUsuario = usuarioStore.getId()
  const tipoUsuario = usuarioStore.getTipo()
  const urlApi = usuarioStore.getUrlApi()
  const usuario = usuarioStore.getUsuario()

  const urlPacientes = urlApi + "usuarios/pacientes/"
  const urlMedicos = urlApi + "usuarios/medicos/"
  const urlEspecialistas = urlApi + "usuarios/especialistas/"
  
  const nombre = ref(usuario.nombre)
  const email = ref(usuario.email)
  const telefono = ref(usuario.telefono)
  const editarPerfil = ref(false)

  const nombrePrevio = ref('')
  const emailPrevio = ref('')
  const telefonoPrevio = ref('')

  function funcion () {
    alert('hola')
  }

  function comenzarEdicion() {
    nombrePrevio.value = nombre.value
    emailPrevio.value = email.value
    telefonoPrevio.value = telefono.value
    editarPerfil.value = true
  }

  function cancelarEdicion() {
    nombre.value = nombrePrevio.value
    email.value = emailPrevio.value
    telefono.value = telefonoPrevio.value
    editarPerfil.value = false
  }

  async function editarUsuario() {
    let url
    switch(tipoUsuario) {
      case ("PACIENTE"):
        url = urlPacientes
        break
      case ("MEDICO"):
        url = urlMedicos
        break
      case ("ESPECIALISTA"):
        url = urlEspecialistas
        break
      default:
        return
    }
    let body = { 
      nombre: nombre.value,
      email: email.value,
      telefono: telefono.value
    }
    let response = await axios.patch(url + idUsuario, body, headers)
    if (response.status != 204) {
      console.log("Error al modificar el usuario ")
    }
    usuarioStore.loadUsuario()
    editarPerfil.value = false
  }

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-avatar 
          image="@/assets/avatar-perfil-por-defecto.png" 
          size="250" 
          @click="funcion"
        />
        <v-container v-if="editarPerfil">
          <v-text-field
            v-model="nombre"
            variant="solo"
          />
          <v-text-field
            v-model="email"
            variant="solo"
          />
          <v-text-field
            v-model="telefono"
            variant="solo"
          />
        </v-container>
        <v-container v-else>
          <v-text-field
            v-model="nombre"
            variant="solo"
            disabled
          />
          <v-text-field
            v-model="email"
            variant="solo"
            disabled
          />
          <v-text-field
            v-model="telefono"
            variant="solo"
            disabled
          />
        </v-container>
        <v-btn 
          v-if="!editarPerfil"
          append-icon="mdi-pencil-outline"
          @click="comenzarEdicion()"
        >
          Editar perfil
        </v-btn>
        <v-btn 
          v-if="editarPerfil"  
          append-icon="mdi-close-thick"
          @click="cancelarEdicion()"
        >
          Cancelar
        </v-btn>
        <v-btn 
          v-if="editarPerfil"  
          append-icon="mdi-check-bold"
          @click="editarUsuario()"
        >
          Confirmar
        </v-btn>
      </v-col>
      <v-col>
        <p>Otra Información de interés</p>
      </v-col>
    </v-row>
  </v-container>
</template>