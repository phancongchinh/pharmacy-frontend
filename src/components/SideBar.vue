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
            <template #title>{{ item.name }}</template>
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
  User,
  Notebook,
  Setting,
  Calendar,
  Phone,
  Message,
  ShoppingCart,
  PieChart,
  CoffeeCup,
  MostlyCloudy,
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
  { name: 'Contacts', index: '/contacts', icon: User },
  { name: 'Deals', index: '/deals', icon: Notebook },
  { name: 'Appointments', index: '/appointments', icon: Calendar },
  { name: 'Emails', index: '/emails', icon: Message },
  { name: 'Calls', index: '/calls', icon: Phone },
  // { name: 'Conversations', index: '/conversations', icon: ShoppingCart },
  // { name: 'Automation', index: '/automation', icon: CoffeeCup },
  {
    name: 'Reports',
    index: '/reports',
    icon: PieChart,
    children: [
      { name: 'Contact Report', index: '/reports/contacts', icon: User },
      { name: 'Deal Report', index: '/reports/deals', icon: Notebook },
      { name: 'Appointment Report', index: '/reports/appointments', icon: Calendar },
      { name: 'Email Report', index: '/reports/emails', icon: Message },
      { name: 'Call Report', index: '/reports/calls', icon: Phone },
    ]
  },
  { name: 'Integration', index: '/integration', icon: MostlyCloudy },
  { name: 'Workplace', index: '/workplace', icon: Setting },
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

.sidebar-brand {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

.sidebar-brand-icon {
  margin-right: 12px;
  color: var(--el-color-primary);
}

.sidebar-brand-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.sidebar-nav {
  flex: 1;
  border: none;
}

.sidebar-bottom {
  border-top: 1px solid var(--el-border-color);
}

.sidebar-bottom-menu {
  border: none;
}

:deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
