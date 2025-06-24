<script setup>
defineProps({
  to: { type: String, default: null },
  icon: String,
  color: String,
  title: String,
  desc: String
})
</script>

<template>
  <v-col
    cols="12"
    sm="6"
    class="mb-4"
  >
    <component
      :is="to ? 'router-link' : 'div'"
      v-bind="to ? { to, style: 'text-decoration: none;' } : {}"
    >
      <v-card
        class="pa-4 text-center hover-elevation"
        elevation="2"
        style="border-radius: 16px;"
        :style="to ? 'cursor: pointer;' : ''"
      >
        <v-icon
          :color="color"
          size="32"
          class="mb-2"
        >
          {{ icon }}
        </v-icon>
        <div class="font-weight-medium mb-1">
          {{ title }}
        </div>
        <div class="text-body-2">
          {{ desc }}
        </div>
      </v-card>
    </component>
  </v-col>
</template>
