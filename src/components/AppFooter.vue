<template>
  <v-footer
    height="40"
    app
  >
    <div class="text-caption text-disabled">
      <p>Página hecha por Raúl González Jiménez</p>
    </div>
    <a
      v-for="item in items"
      :key="item.title"
      :href="item.href"
      :title="item.title"
      class="d-inline-block mx-2 social-link"
      rel="noopener noreferrer"
      target="_blank"
    >
      <v-icon :icon="item.icon" />
    </a>
  </v-footer>
</template>

<script setup>
  const items = [
    {
      title: 'Linkedin',
      icon: `mdi-linkedin`,
      href: 'https://www.linkedin.com/in/ra%C3%BAl-gonz%C3%A1lez-jim%C3%A9nez-659753305/',
    },
    {
      title: 'GitHub',
      icon: 'mdi-github',
      href: 'https://github.com/Raul-GJ',
    },
  ]
</script>

<style scoped lang="sass">
  .social-link :deep(.v-icon)
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
    text-decoration: none
    transition: .2s ease-in-out

    &:hover
      color: rgba(25, 118, 210, 1)
</style>
