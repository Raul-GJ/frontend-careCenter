<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { registro } from '@/services/apiAuth'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()

  const router = useRouter()

  const usuario = ref({
    nombre: 'Medico',
    apellidos: 'Apellido',
    email: 'medico@ejemplo.com',
    telefono: '123456789',
    fechaNacimiento: '2000-01-01',
    sexo: 'hombre',
    direccion: 'Calle Falsa 123',
    dni: '42315678A',
    contrasenya: 'Contrasena123',
    nss: '123123456456',
    nCol: '212345678',
    centroDeSalud: 'Centro de Salud Falso',
    especialidad: 'Medicina General'
  })
  const rol = ref('')
  const roles = ref(['Paciente', 'Medico de familia', 'Especialista'])
  const sexoOptions = ref(['hombre', 'mujer'])
  const mostrarContrasenya = ref(false)

  const errorValue = ref(false)
  const errorMessage = ref('')

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
          dni: value => {
            if (value == '') return true;
            const pattern = /^[0-9]{8}[A-Z]$/
            return pattern.test(value) || 'DNI incorrecto'
          },
          nCol: value => {
            if (value == '') return true;
            const pattern = /^[0-9]{9}$/
            return pattern.test(value) || 'Número de colegiado incorrecto'
          },
          nss: value => {
            if (value == '') return true;
            const pattern = /^[0-9]{12}$/
            return pattern.test(value) || 'Número de la Seguridad Social incorrecto'
          },
        })

  async function registrar() {
    loadingStore.start()
    
    // Check required fields and validation rules
    console.log('Intentando registrar usuario:', usuario.value, 'Rol:', rol.value)
    if (reglas.value.email(usuario.value.email || '') !== true ||
        reglas.value.necesario(usuario.value.nombre || '') !== true ||
        reglas.value.necesario(usuario.value.apellidos || '') !== true ||
        reglas.value.necesario(rol.value) !== true ||
        (rol.value === 'Paciente' && reglas.value.nss(usuario.value.nss || '') !== true) ||
        ((rol.value === 'Medico de familia' || rol.value === 'Especialista') && 
         (reglas.value.nCol(usuario.value.nCol || '') !== true || 
          reglas.value.necesario(usuario.value.centroDeSalud || '') !== true)) ||
        (rol.value === 'Especialista' && reglas.value.necesario(usuario.value.especialidad || '') !== true) ||
        reglas.value.necesario(usuario.value.fechaNacimiento || '') !== true ||
        reglas.value.necesario(usuario.value.sexo || '') !== true ||
        reglas.value.necesario(usuario.value.direccion || '') !== true ||
        reglas.value.dni(usuario.value.dni || '') !== true ||
        reglas.value.necesario(usuario.value.contrasenya || '') !== true) {
      console.log('Campos incorrectos')
      loadingStore.stop()
      return
    }
    
    let rolFormateado
    switch (rol.value) {
      case ('Paciente'):
        rolFormateado = 'paciente'
        break
      case ('Medico de familia'):
        rolFormateado = 'medico'
        break
      case ('Especialista'):
        rolFormateado = 'especialista'
        break
      default:
        console.log('Rol incorrecto')
        loadingStore.stop()
        return
    }
    let response
    try {
      response = await registro(rolFormateado, usuario.value)
      if (response == null || response.status != 201) {
        console.log('Error al registrar el usuario')
        errorValue.value = true
        errorMessage.value = response?.data?.mensaje || 'Error al registrar el usuario. Por favor, inténtelo de nuevo más tarde.'
        loadingStore.stop()
        return
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error)
      errorValue.value = true
      errorMessage.value = error?.response?.data?.mensaje || 'Error al registrar el usuario. Por favor, inténtelo de nuevo más tarde.'
      loadingStore.stop()
      return
    }
    
    
    console.log('Usuario registrado correctamente')
    loadingStore.stop()
    router.push('/login')
  }

</script>

<template>
  <v-container>
    <h1>Registro</h1>
    <p>* Indica que un campo es obligatorio</p>
    <v-form>
      <v-text-field 
        v-model="usuario.nombre"
        :rules="[reglas.necesario]" 
        label="Nombre *"
      />
      <v-text-field 
        v-model="usuario.apellidos" 
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
        v-if="rol == 'Paciente'" 
        v-model="usuario.nss" 
        label="Número de la Seguridad Social *"
        :rules="[reglas.necesario, reglas.nss]"
      />
      <v-text-field 
        v-if="rol == 'Medico de familia' || rol == 'Especialista'" 
        v-model="usuario.nCol" 
        label="nCol *"
        :rules="[reglas.necesario, reglas.nCol]"
      />
      <v-text-field 
        v-if="rol == 'Medico de familia' || rol == 'Especialista'" 
        v-model="usuario.centroDeSalud" 
        label="Centro de Salud *"
        :rules="[reglas.necesario]"
      />
      <v-text-field 
        v-if="rol == 'Especialista'" 
        v-model="usuario.especialidad" 
        label="Especialidad *"
        :rules="[reglas.necesario]"
      />
      <v-text-field 
        v-model="usuario.email"  
        label="Correo electrónico *" 
        :rules="[reglas.necesario, reglas.email]"
      />
      <v-text-field 
        v-model="usuario.telefono"  
        label="Telefono" 
        :rules="[reglas.telefono]"
      />
      <v-text-field 
        v-model="usuario.fechaNacimiento" 
        label="Fecha de nacimiento" 
        type="date"
        :rules="[reglas.necesario]"
      />
      <v-select 
        v-model="usuario.sexo" 
        :items="sexoOptions" 
        label="Sexo *"
        :rules="[reglas.necesario]"
      />
      <v-text-field 
        v-model="usuario.direccion" 
        label="Dirección"
        :rules="[reglas.necesario]"
      />
      <v-text-field 
        v-model="usuario.dni" 
        label="DNI"
        :rules="[reglas.necesario, reglas.dni]"
      />
      <v-text-field
        v-model="usuario.contrasenya"
        :append-icon="mostrarContrasenya ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[reglas.necesario]"
        :type="mostrarContrasenya ? 'text' : 'password'"
        label="Contraseña *"
        counter
        @click:append="mostrarContrasenya = !mostrarContrasenya"
      />
      <v-alert 
        v-if="errorValue" 
        type="error"
        closable
        @click:close="errorValue = false"
      >
        {{ errorMessage }}
      </v-alert>
      <v-btn @click="registrar">
        Registrar
      </v-btn>
    </v-form>
  </v-container>
</template>