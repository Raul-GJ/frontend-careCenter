<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  
  const usuarioStore = useUsuarioStore()

  const idUsuario = usuarioStore.getId()
  const tipoUsuario = usuarioStore.getTipo()
  const urlApi = usuarioStore.getUrlApi()

  const urlPacientes = urlApi + "usuarios/pacientes/"
  const urlMedicos = urlApi + "usuarios/medicos/"
  const urlEspecialistas = urlApi + "usuarios/especialistas/"

  const usuario = ref(null)
  
  const nombreUsuario = ref('')
  const email = ref('')
  const telefono = ref('')
  const editarPerfil = ref(false)

  function funcion () {
    alert('hola')
  }

  async function loadUsuario() {
    let response
    switch (tipoUsuario) {
      case "Paciente":
        response = await axios.get(urlPacientes + idUsuario)
        break
      case "Medico":
        response = await axios.get(urlMedicos + idUsuario)
        break
      case "Especialista":
        response = await axios.get(urlEspecialistas + idUsuario)
        break
      default:
        alert("Tipo de usuario incorrecto")
        return
    }
    usuario.value = response.data
    nombreUsuario.value = usuario.value.nombre
    email.value = usuario.value.email
    telefono.value = usuario.value.telefono
    usuarioStore.setUsuario(usuario.value)
  }

  loadUsuario()
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-avatar image="@/assets/avatar-perfil-por-defecto.png" size="250" @click="funcion"/>
        <v-container v-if="editarPerfil">
          <v-text-field
            v-model="nombreUsuario"
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
            v-model="nombreUsuario"
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
        <v-btn append-icon="mdi-pencil-outline" @click="editarPerfil = !editarPerfil">Editar perfil</v-btn>
      </v-col>
      <v-col>
        <p>Otra Información de interés</p>
      </v-col>
    </v-row>
  </v-container>
</template>