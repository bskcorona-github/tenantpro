<template>
    <div>Loading...</div>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  router.push("/users"); 
  </script>
  