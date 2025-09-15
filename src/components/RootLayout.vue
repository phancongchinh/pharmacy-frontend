<template>
  <div>
    <!-- TopBar -->
    <TopBar @toggle-sidebar="toggleSidebar" v-if="!isAuthPage" />

    <!-- SideBar -->
    <SideBar
      ref="sidebarRef"
      :is-open="sidebarOpen"
      @update:is-open="sidebarOpen = $event"
      v-if="!isAuthPage"
    />

    <!-- Main Content Area -->
    <div
      class="main-content small-scrollbar"
      :class="{
        'main-content-auth-page': isAuthPage,
        'sidebar-open': sidebarOpen && !isAuthPage,
        '': !isAuthPage,
      }"
    >
      <div class="content-area">
        <div class="content-wrapper">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SideBar from './SideBar.vue'
import TopBar from './TopBar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const sidebarOpen = ref(true)
const sidebarRef = ref()

const toggleSidebar = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggleSidebar()
  }
}

// Computed properties
const isAuthPage = computed(() => {
  const path = route.path
  return path === '/login' || path === '/register' || path === '/logout' || path.startsWith('/oauth/')
})
</script>
