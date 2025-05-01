<script setup>
  import { ref } from 'vue'
  import api from '@/services/api'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useRouter } from 'vue-router'

  const usuarioStore = useUsuarioStore()
  const router = useRouter()

  const nombre = ref('Nombre de prueba')
  const apellidos = ref('Apellidos de prueba')
  const rol = ref('Especialista')
  const roles = ref(['Paciente', 'Médico de familia', 'Especialista'])
  const nCol = ref('123456')
  const especialidad = ref('Cardiología')
  const correo = ref('prueba@gmail.com')
  const telefono = ref(123123123)
  const contrasenya = ref('prueba')
  const mostrarContrasenya = ref(false)
  const reglas = ref({
          necesario: value => !!value || 'Campo necesario.',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Correo electrónico incorrecto.'
          },
          telefono: value => {
            if (value == '') return true;
            const pattern = /^[0-9]{9}$/
            return pattern.test(value) || 'Número de teléfono incorrecto'
          },
        })

  async function registrar() {
    if (!reglas.value.email(correo.value) === true) {
      console.log('Campos incorrectos')
      return
    }
    let body = { 
      nombre: nombre.value,
      apellidos: apellidos.value,
      email: correo.value,
      telefono: telefono.value,
      contrasenya: contrasenya.value
    }
    let url
    switch (rol.value) {
      case ('Paciente'):
        url = 'auth/registro/paciente/'
        break
      case ('Medico de familia'):
        url = 'auth/registro/medico/'
        body.nCol = nCol.value
        break
      case ('Especialista'):
        url = 'auth/registro/especialista/'
        body.nCol = nCol.value
        body.especialidad = especialidad.value
        break
      default:
        console.log('Rol incorrecto')
        return
    }
    let response = await api.post(url, body);
    if (response.status != 201) {
      console.log('Ha ocurrido un error creando el usuario')
      return
    }

    let location = response.headers.get("location")
    let idUsuario = location.split("/")[8]

    usuarioStore.setId(idUsuario)
    await usuarioStore.loadUsuario()
    if (usuarioStore.getUsuario() == null) {
      console.log('Error al cargar el usuario')
      return
    }

    localStorage.setItem('token', response.data.token);
    router.push('/home')
  }

</script>

<template>
  <v-container>
    <h1>Página de registro</h1>
    <p>* Indica que un campo es obligatorio</p>
    <v-form @submit.prevent @submit="registrar">
      <v-text-field 
        v-model="nombre"
        :rules="[reglas.necesario]" 
        label="Nombre *"
      />
      <v-text-field 
        v-model="apellidos" 
        :rules="[reglas.necesario]" 
        label="Apellidos *"
      />
      <v-select 
        v-model="rol" 
        :items="roles" 
        :rules="[reglas.necesario]"
        label="Rol *"
      />
      <v-text-field 
        v-if="rol == 'Medico' || rol == 'Especialista'" 
        v-model="nCol" 
        label="nCol *"
        :rules="[reglas.necesario]"
      />
      <v-text-field 
        v-if="rol == 'Especialista'" 
        v-model="especialidad" 
        label="Especialidad *"
        :rules="[reglas.necesario]"
      />
      <v-text-field 
        v-model="correo"  
        label="Correo electrónico *" 
        :rules="[reglas.necesario, reglas.email]"
      />
      <v-text-field 
        v-model="telefono"  
        label="Telefono" 
        :rules="[reglas.telefono]"
      />
      <v-text-field
        v-model="contrasenya"
        :append-icon="mostrarContrasenya ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[reglas.necesario]"
        :type="mostrarContrasenya ? 'text' : 'password'"
        label="Contraseña *"
        counter
        @click:append="mostrarContrasenya = !mostrarContrasenya"
      />
      <v-btn type="submit">
        Registrar
      </v-btn>
    </v-form>
  </v-container>
</template>