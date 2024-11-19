<template>
    <div class="sidebar">
      <nav>
        <ul>
          <li>
            <NuxtLink to="/users" class="link">アカウント管理</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/tenants" class="link">テナント管理</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/products" class="link">商品管理</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/orders" class="link">注文管理</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/sales" class="link">売上管理</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <style>
  .sidebar {
    width: 200px;
    height: 100vh;
    background-color: #2c3e50;
    color: #ecf0f1;
    position: fixed;
    top: 0;
    left: 0;
    padding: 1rem;
  }
  .sidebar nav ul {
    list-style: none;
    padding: 0;
  }
  .sidebar nav ul li {
    margin-bottom: 1rem;
  }
  .sidebar .link {
    text-decoration: none;
    color: #ecf0f1;
    font-weight: bold;
  }
  .sidebar .link:hover {
    color: #1abc9c;
  }
  </style>
  