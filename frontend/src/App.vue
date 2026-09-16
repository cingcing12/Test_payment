<template>
  <div class="app-container">
    <header class="navbar">
      <div class="logo">
        <router-link to="/">VueShop</router-link>
      </div>
      <nav class="nav-links">
        <router-link to="/">Products</router-link>
        <router-link to="/cart" class="cart-link">
          Cart 
          <span v-if="cartStore.totalItems > 0" class="badge">{{ cartStore.totalItems }}</span>
        </router-link>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useCartStore } from './store/cart'
const cartStore = useCartStore()
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  background-color: var(--nav-bg);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo a {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--primary-color);
  text-decoration: none;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--primary-color);
}

.cart-link {
  position: relative;
  display: flex;
  align-items: center;
}

.badge {
  background: var(--primary-color);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.15rem 0.5rem;
  border-radius: 50px;
  margin-left: 0.5rem;
  box-shadow: 0 0 10px rgba(0,210,255,0.4);
}

.main-content {
  flex: 1;
  padding: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
