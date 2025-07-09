<script setup>
  import { useSesionStore } from '@/stores/sesionStore';
  import { useConsultaStore } from '@/stores/consultaStore';
  import { useUsuarioStore } from '@/stores/usuarioStore';
  import { ref } from 'vue';
  import { useLoadingStore } from '@/stores/loadingStore';
  import { useRouter } from 'vue-router';
  const loadingStore = useLoadingStore();
  const router = useRouter();

  const reglas = ref({
          necesario: value => !!value || 'Campo necesario.',
          limite: value => value.length <= 10000 || 'Máximo 10.000 caracteres',
        })

  const sesionStore = useSesionStore()
  const consultaStore = useConsultaStore()
  const usuarioStore = useUsuarioStore()

  const usuario = ref(null)
  
  const sanitarios = ref([])

  const receptor = ref(null)
  const asunto = ref('')
  const mensaje = ref('')

  const formularioValido = ref(false);
  const formulario = ref(null);

  async function load() {
    loadingStore.start()
    usuario.value = await sesionStore.getUsuario()
    const medico = await usuarioStore.getUsuario(usuario.value.medicoCabecera)
    // Agregar etiqueta descriptiva al médico de cabecera
    medico.nombreCompleto = `${medico.nombre} ${medico.apellidos} (médico de cabecera)`
    sanitarios.value.push(medico)
    
    for (let idEspecialista of usuario.value.especialistas) {
      const especialista = await usuarioStore.getUsuario(idEspecialista)
      // Agregar especialidad al nombre del especialista
      especialista.nombreCompleto = `${especialista.nombre} ${especialista.apellidos} (${especialista.especialidad})`
      sanitarios.value.push(especialista)
    }
    loadingStore.stop()
  }

  async function enviarConsulta() {
    loadingStore.start()
    if (!formulario.value?.validate()) {
      alert("Los datos introducidos son incorrectos")
      loadingStore.stop()
      return
    }
    let body = { emisor: usuario.value.id, receptor: receptor.value.id, asunto: asunto.value, mensaje: mensaje.value }
    console.log(body)
    await consultaStore.crearConsulta(body)

    alert("Consulta enviada")
    loadingStore.stop()
    router.back()
  }

  load()
</script>

<template>
  <v-container v-if="!loadingStore.loading">
    <v-form 
      ref="formulario" 
      v-model="formularioValido"
    >
      <v-select
        v-model="receptor"
        label="Seleccionar destinatario"
        item-title="nombreCompleto"
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