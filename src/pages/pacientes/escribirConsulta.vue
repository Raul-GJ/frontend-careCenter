<script setup>
  import { useUsuarioStore } from '@/stores/usuarioStore';
  import { useConsultaStore } from '@/stores/consultaStore';
  import { useEspecialistaStore } from '@/stores/especialistaStore';
  import { useMedicoStore } from '@/stores/medicoStore';
  import { ref } from 'vue';
  import api from '@/services/api';

  const reglas = ref({
          necesario: value => !!value || 'Campo necesario.',
          limite: value => value.length <= 10000 || 'Máximo 10.000 caracteres',
        })

  const usuarioStore = useUsuarioStore()
  const consultaStore = useConsultaStore()
  const especialistaStore = useEspecialistaStore()
  const medicoStore = useMedicoStore()

  const usuario = usuarioStore.getUsuario()
  
  const sanitarios = ref([])

  const receptor = ref(null)
  const asunto = ref('')
  const mensaje = ref('')

  const formularioValido = ref(false);
  const formulario = ref(null);

  async function load() {
    await consultaStore.loadConsultas()
    await especialistaStore.loadEspecialistas()
    await medicoStore.loadMedicos()
    sanitarios.value.push(medicoStore.getMedico(usuario.medicoCabecera))
    especialistaStore.especialistas.forEach(e => sanitarios.value.push(e))
  }

  async function enviarConsulta() {
    if (!formulario.value?.validate()) {
      alert("Los datos introducidos son incorrectos")
      return
    }
    let body = { emisor: usuario.id, receptor: receptor.value.id, asunto: asunto.value, mensaje: mensaje.value }
    
    let response
    if (receptor.value.id == usuario.medicoCabecera)
      response = await api.post("consultas/medicos/", body)
    else
      response = await api.post("consultas/especialistas/", body)

    if (response.status != 201) {
      console.log("Error al crear la consulta")
      return
    }

    let location = response.headers.get("location")
    let idConsulta = location.split("/")[7]

    let responseConsulta = await api.get("consultas/" + idConsulta)

    if (responseConsulta.status != 200) {
      console.log("Error al recuperar la consulta")
      return
    }

    consultaStore.addConsulta(responseConsulta.body)
    alert("Consulta enviada")
    receptor.value = null
    asunto.value = ''
    mensaje.value = ''
  }

  load()
</script>

<template>
  <v-container>
    <v-form 
      ref="formulario" 
      v-model="formularioValido"
    >
      <v-select
        v-model="receptor"
        label="Seleccionar destinatario"
        item-title="nombre"
        :items="sanitarios"
        :rules="[reglas.necesario]"
        return-object
      />
      <v-text-field 
        v-model="asunto"
        label="Asunto"
        :rules="[reglas.necesario]"
      />
      <v-container>
        <v-textarea
          v-model="mensaje"
          label="Mensaje"
          :rules="[reglas.necesario, reglas.limite]"
          auto-grow
        />
        <v-btn
          prepend-icon="mdi-send-variant"
          @click="enviarConsulta()"  
        >
          Enviar
        </v-btn>
      </v-container>
    </v-form>
  </v-container>
</template>