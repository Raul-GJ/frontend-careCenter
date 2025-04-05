<script setup>
  import { ref } from 'vue'
  const reglas = ref({
          necesario: value => !!value || 'Campo necesario.',
          caracteresMinimos: v => v.length >= 8 || 'Minimo 8 caracteres',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Correo electrónico incorrecto.'
          },
        })

  const correo = ref('')
  const contrasenya = ref('')

  function login() {

  }

</script>

<template>
  <v-container>
    <h1>Página de Login</h1>
    <p>* Indica que un campo es obligatorio</p>
    <v-form @submit.prevent @submit="login">  
      <v-text-field 
        v-model="correo"  
        label="Correo electrónico *" 
        :rules="[reglas.necesario, reglas.email]"
      />
      <v-text-field
        v-model="contrasenya"
        :append-icon="mostrarContrasenya ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[reglas.necesario, reglas.caracteresMinimos]"
        :type="mostrarContrasenya ? 'text' : 'password'"
        label="Contraseña *"
        counter
        @click:append="mostrarContrasenya = !mostrarContrasenya"
      />
      <!-- <v-btn type="submit">
        Login
      </v-btn> -->
      <router-link to="/home">
        <v-btn>Login</v-btn>
      </router-link>
    </v-form>
  </v-container>
</template>