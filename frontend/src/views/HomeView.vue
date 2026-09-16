<template>
  <div class="home">
    <div class="hero fade-in">
      <h1>Premium Gear for Modern Lives</h1>
      <p>Discover our curated collection of high-end products.</p>
    </div>

    <div v-if="loading" class="loading">Loading products...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card fade-in">
        <div class="product-img-wrapper">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="desc">{{ product.description }}</p>
          <div class="price-action">
            <span class="price">${{ product.price.toFixed(2) }}</span>
            <button @click="addToCart(product)" class="btn btn-primary">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useCartStore } from '../store/cart'

const products = ref([])
const loading = ref(true)
const error = ref('')
const cartStore = useCartStore()

onMounted(async () => {
  try {
    const response = await axios.get('https://test-payment-black.vercel.app/api/products')
    products.value = response.data
  } catch (err) {
    error.value = 'Failed to load products.'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const addToCart = (product) => {
  cartStore.addToCart(product)
}
</script>

<style scoped>
.hero {
  text-align: center;
  margin-bottom: 4rem;
  padding: 4rem 0;
  background: radial-gradient(circle at center, rgba(0, 210, 255, 0.1) 0%, transparent 60%);
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: -webkit-linear-gradient(45deg, #00d2ff, #3a7bd5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 1.2rem;
  color: var(--text-muted);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border-color: rgba(0, 210, 255, 0.3);
}

.product-img-wrapper {
  height: 200px;
  overflow: hidden;
}

.product-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-img-wrapper img {
  transform: scale(1.05);
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.desc {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  min-height: 44px;
}

.price-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.loading, .error {
  text-align: center;
  font-size: 1.2rem;
  padding: 3rem;
}

.error {
  color: var(--danger-color);
}
</style>
