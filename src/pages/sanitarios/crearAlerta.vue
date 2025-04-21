<script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useUsuarioStore } from '@/stores/usuarioStore';
  import { usePacienteStore } from '@/stores/pacienteStore';

  const usuarioStore = useUsuarioStore()
  const pacienteStore = usePacienteStore()

  pacienteStore.loadPacientes()
</script>

<template>
  <v-container>
    <h1>Hola</h1>
  </v-container>
</template>