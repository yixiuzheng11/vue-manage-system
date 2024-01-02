<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="sidebarStore.collapse"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
    >
      <template v-for="item in items">
        <template v-if="item.children">
          <el-sub-menu :index="item.url" :key="item.id">
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-sub-menu
                  v-if="subItem.children"
                  :index="subItem.url"
                  :key="subItem.id"
              >
                <template #title>{{ subItem.name }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.children" :key="threeItem.id" :index="threeItem.url">
                  {{ threeItem.name }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.url">
                {{ subItem.name }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.url" :key="item.id">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.name }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';
import {usePermissStore} from "../store/permiss";


const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebarStore = useSidebarStore();
const permStore = usePermissStore();
const items = permStore.menus;
console.log(items);
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
