<template>
  <div class="cart-view fade-in">
    <h1>Your Cart</h1>
    
    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>Your cart is empty.</p>
      <router-link to="/" class="btn btn-primary mt-4">Browse Products</router-link>
    </div>
    
    <div v-else class="cart-container">
      <div class="cart-items">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <div class="item-img">
            <img :src="item.productDetails.image" :alt="item.productDetails.name" />
          </div>
          <div class="item-details">
            <h3>{{ item.productDetails.name }}</h3>
            <p class="price">${{ item.productDetails.price.toFixed(2) }}</p>
          </div>
          <div class="item-actions">
            <div class="qty-control">
              <button @click="updateQty(item.id, item.quantity - 1)" class="btn-qty">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="updateQty(item.id, item.quantity + 1)" class="btn-qty">+</button>
            </div>
            <button @click="cartStore.removeFromCart(item.id)" class="btn btn-danger btn-sm">Remove</button>
          </div>
        </div>
      </div>
      
      <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Items ({{ cartStore.totalItems }}):</span>
          <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <button @click="proceedToCheckout" class="btn btn-primary btn-block">
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../store/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

const updateQty = (id, newQty) => {
  cartStore.updateQuantity(id, newQty)
}

const proceedToCheckout = () => {
  router.push('/checkout')
}
</script>

<style scoped>
.cart-view {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--card-border);
  padding-bottom: 1rem;
}

.empty-cart {
  text-align: center;
  padding: 4rem;
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px dashed var(--card-border);
}

.mt-4 {
  margin-top: 1rem;
}

.cart-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .cart-container {
    grid-template-columns: 1fr;
  }
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  align-items: center;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1rem;
  gap: 1.5rem;
}

.item-img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.price {
  color: var(--primary-color);
  font-weight: 600;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255,255,255,0.05);
  padding: 0.25rem;
  border-radius: 8px;
}

.btn-qty {
  background: transparent;
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.btn-qty:hover {
  background: rgba(255,255,255,0.1);
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.cart-summary {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 2rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--text-muted);
}

.summary-row.total {
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  border-top: 1px solid var(--card-border);
  padding-top: 1rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.btn-block {
  width: 100%;
}
</style>
