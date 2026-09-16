<template>
  <div class="checkout-view fade-in">
    <div class="checkout-container">
      <div v-if="success" class="success-screen fade-in">
        <div class="icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2>Payment Successful!</h2>
        <p>Thank you for your order.</p>
        <router-link to="/" class="btn btn-primary mt-4">Continue Shopping</router-link>
      </div>

      <div v-else class="payment-section">
        <h2>Checkout</h2>
        <p class="subtitle">Scan the Bakong KHQR below to pay.</p>

        <div v-if="loading" class="loading">
          Generating KHQR...
        </div>
        <div v-else-if="error" class="error">
          {{ error }}
          <br>
          <button @click="initCheckout" class="btn btn-secondary mt-4">Retry</button>
        </div>
        
        <div v-else class="qr-display fade-in">
          <div class="qr-wrapper">
            <qrcode-vue :value="qrString" :size="250" level="M" />
            <div class="bakong-logo">
              <!-- Placeholder for Bakong Logo inside QR -->
              <div class="logo-inner">B</div>
            </div>
          </div>
          
          <div class="amount-display">
            Total to pay: <span>${{ total }}</span>
          </div>
          
          <div class="actions">
            <button 
              @click="verifyPayment" 
              class="btn btn-primary btn-block"
              :disabled="verifying"
            >
              {{ verifying ? 'Verifying...' : 'I have paid (Verify)' }}
            </button>
            <p v-if="verifyError" class="verify-error">{{ verifyError }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import QrcodeVue from 'qrcode.vue'
import { useCartStore } from '../store/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

const loading = ref(true)
const error = ref('')
const qrString = ref('')
const md5Hash = ref('')
const total = ref(0)

const verifying = ref(false)
const verifyError = ref('')
const success = ref(false)

let pollInterval = null

const initCheckout = async () => {
  if (cartStore.items.length === 0) {
    router.push('/')
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.post('https://test-payment-black.vercel.app/api/checkout', {
      items: cartStore.items
    })
    
    qrString.value = response.data.qrString
    md5Hash.value = response.data.md5
    total.value = response.data.total

    // Start auto-polling every 3 seconds
    if (pollInterval) clearInterval(pollInterval)
    pollInterval = setInterval(verifyPayment, 3000)
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to generate KHQR.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initCheckout()
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

const verifyPayment = async () => {
  if (!md5Hash.value || verifying.value || success.value) return
  
  verifying.value = true
  
  try {
    const response = await axios.post('https://test-payment-black.vercel.app/api/verify-payment', {
      md5: md5Hash.value
    })
    
    // Usually responseCode 0 means success in Bakong API
    if (response.data.responseCode === 0) {
      success.value = true
      cartStore.clearCart()
      if (pollInterval) clearInterval(pollInterval)
    }
  } catch (err) {
    // Only log polling errors to console, don't show on UI to prevent flashing
    console.error('Polling verification:', err.response?.data?.error || 'Verification failed.')
  } finally {
    verifying.value = false
  }
}
</script>

<style scoped>
.checkout-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.checkout-container {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  text-align: center;
}

.subtitle {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.qr-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-wrapper {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  position: relative;
  display: inline-block;
  box-shadow: 0 10px 25px rgba(0,210,255,0.2);
}

.bakong-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.logo-inner {
  background: #E3000F; /* Bakong Red */
  color: white;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
}

.amount-display {
  margin: 2rem 0;
  font-size: 1.2rem;
  color: var(--text-muted);
}

.amount-display span {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  margin-left: 0.5rem;
}

.actions {
  width: 100%;
}

.btn-block {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}

.verify-error {
  color: var(--danger-color);
  margin-top: 1rem;
  font-size: 0.9rem;
}

.success-screen {
  padding: 2rem 0;
}

.icon-wrapper {
  color: var(--success-color);
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
}

.success-screen h2 {
  color: var(--success-color);
  margin-bottom: 0.5rem;
}

.success-screen p {
  color: var(--text-muted);
}

.mt-4 {
  margin-top: 1.5rem;
}
</style>
