<script setup>
  import { useUsuarioStore } from '@/stores/usuarioStore';
  import { useConsultaStore } from '@/stores/consultaStore';
  import { useEspecialistaStore } from '@/stores/especialistaStore';
  import { useMedicoStore } from '@/stores/medicoStore';
  import { ref } from 'vue';
  import { crearConsulta, obtenerConsulta } from '@/services/apiConsultas';
  import { useLoadingStore } from '@/stores/loadingStore';
  const loadingStore = useLoadingStore();

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
    loadingStore.start()
    await consultaStore.loadConsultas()
    await especialistaStore.loadEspecialistas()
    await medicoStore.loadMedicos()
    sanitarios.value.push(medicoStore.getMedico(usuario.medicoCabecera))
    especialistaStore.especialistas.forEach(e => sanitarios.value.push(e))
    loadingStore.stop()
  }

  async function enviarConsulta() {
    loadingStore.start()
    if (!formulario.value?.validate()) {
      alert("Los datos introducidos son incorrectos")
      loadingStore.stop()
      return
    }
    let body = { emisor: usuario.id, receptor: receptor.value.id, asunto: asunto.value, mensaje: mensaje.value }
    let response = await crearConsulta(body)

    if (response.status != 201) {
      console.log("Error al crear la consulta")
      loadingStore.stop()
      return
    }

    let location = response.headers.get("location")
    let idConsulta = location.split("/").at(-1)
    console.log("Consulta creada con ID:", idConsulta)

    let responseConsulta = await obtenerConsulta(idConsulta)

    if (responseConsulta.status != 200) {
      console.log("Error al recuperar la consulta")
      loadingStore.stop()
      return
    }

    consultaStore.addConsulta(responseConsulta.body)
    alert("Consulta enviada")
    receptor.value = null
    asunto.value = ''
    mensaje.value = ''
    loadingStore.stop()
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