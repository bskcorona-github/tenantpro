<script setup lang="ts">
</script>

<template>
  <div class="layout">
    <Sidebar />
    <div class="content">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import Sidebar from "~/components/Sidebar.vue";
</script>

<style>
.layout {
  display: flex;
}
.content {
  margin-left: 200px;
  padding: 2rem;
  width: 100%;
}
</style>
