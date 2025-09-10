<template>
  <div id="app">
    <!-- Main Application Content -->
    <RootLayout>
      <RouterView />
    </RootLayout>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import RootLayout from '@/components/RootLayout.vue'
</script>

<style>
#app {
  min-height: 100vh;
  position: relative;
}

/* Global styles for the application */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8fafc;
}

/* Dialog Styles */
.el-dialog__body {
  height: 50vh !important;
  min-height: 50vh !important;
  max-height: 65vh !important;
}
</style>
