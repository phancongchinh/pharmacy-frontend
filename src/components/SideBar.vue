<template>
  <el-aside :class="['sidebar', isOpen ? 'sidebar-open' : 'sidebar-closed']" width="256px">
    <div class="sidebar-content">
      <!-- Navigation -->
      <el-menu
        :default-active="activeRoute"
        class="sidebar-nav"
        @select="handleSelect"
        :collapse="false"
      >
        <template v-for="item in navigation" :key="item.index">
          <!-- Regular menu item -->
          <el-menu-item v-if="!item.children" :index="item.index">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <template #title>
              <div class="menu-item-title">
                {{ item.name }}
              </div>
            </template>
          </el-menu-item>

          <!-- Submenu -->
          <el-sub-menu v-else :index="item.index">
            <template #title>
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.index" :index="child.index">
              <el-icon>
                <component :is="child.icon" />
              </el-icon>
              <template #title>{{ child.name }}</template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>

      <!-- Bottom section -->
      <div class="sidebar-bottom">
        <el-menu class="sidebar-bottom-menu">
          <!--          <el-menu-item index="logout" @click="handleLogout">-->
          <!--            <el-icon>-->
          <!--              <SwitchButton />-->
          <!--            </el-icon>-->
          <!--            <template #title>Sign Out</template>-->
          <!--          </el-menu-item>-->
        </el-menu>
      </div>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  House,
  Phone,
  ShoppingCart,
  DocumentAdd,
  DocumentRemove,
  Orange,
} from '@element-plus/icons-vue'

// Define props
const props = defineProps<{
  isOpen?: boolean
}>()

// Define emits
const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const route = useRoute()
const router = useRouter()

// Use shallowRef instead of ref for component objects to avoid reactivity warning
const navigation = shallowRef([
  { name: 'Dashboard', index: '/', icon: House },
  { name: 'Medicine', index: '/medicines', icon: Orange },
  { name: 'Sales', index: '/sales', icon: ShoppingCart },
  { name: 'Receipt Note', index: '/receipt-notes', icon: DocumentAdd },
  { name: 'Delivery Note', index: '/delivery-notes', icon: DocumentRemove },
  { name: 'Suppliers', index: '/suppliers', icon: Phone },
])

// Computed property for active route
const activeRoute = computed(() => route.path)

// Handle menu selection
const handleSelect = (index: string) => {
  router.push(index)
}

// Expose toggle function for parent component
const toggleSidebar = () => {
  emit('update:isOpen', !props.isOpen)
}

// Expose the toggle function
defineExpose({
  toggleSidebar,
})
</script>

<style scoped>
.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-nav {
  flex: 1;
  border: none;
}

.sidebar-bottom-menu {
  border: none;
}
</style>
