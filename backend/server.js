try {
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { BakongKHQR, khqrData, IndividualInfo } = require('bakong-khqr');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mock products
const products = [
  {
    id: 1,
    name: 'Wireless Noise-Canceling Headphones',
    price: 0.50,
    description: 'Premium over-ear headphones with active noise cancellation.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  },
  {
    id: 2,
    name: 'Minimalist Smartwatch',
    price: 199.50,
    description: 'Sleek design with health tracking and notifications.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    price: 149.00,
    description: 'RGB mechanical keyboard with tactile switches.',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
  }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/checkout', (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    let total = 0;
    items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        total += product.price * item.quantity;
      }
    });

    if (total <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    // Generate Bakong KHQR
    const optionalData = {
      currency: khqrData.currency.usd,
      amount: parseFloat(total.toFixed(2)),
      mobileNumber: "85512345678",
      storeLabel: "VueShop",
      terminalLabel: "WebTerminal",
      purposeOfTransaction: "E-Commerce Purchase",
      languageData: {
          languagePreference: "km",
          merchantNameAlternateLanguage: "VueShop KH",
          merchantCityAlternateLanguage: "Phnom Penh"
      },
      merchantAlternateLanguagePreference: "km",
      billNumber: uuidv4().replace(/-/g, '').substring(0, 20),
      expirationTimestamp: Date.now() + (15 * 60 * 1000) // 15 minutes to expire (required for fixed amount Dynamic QR)
    };

    const individualInfo = new IndividualInfo(
      process.env.BAKONG_ACCOUNT || "sokpheak_vong@bkrt",
      "Sokpheak Vong",
      "Phnom Penh",
      optionalData
    );

    const khqr = new BakongKHQR();
    const response = khqr.generateIndividual(individualInfo);

    if (response.status.code === 0) {
       return res.json({
         qrString: response.data.qr,
         md5: response.data.md5,
         total: total.toFixed(2)
       });
    } else {
       return res.status(500).json({ error: 'Failed to generate KHQR', details: response.status.message });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { md5 } = req.body;
    if (!md5) {
      return res.status(400).json({ error: 'MD5 hash is required' });
    }

    const apiUrl = process.env.BAKONG_API_URL || 'https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5';
    
    // Call Bakong API to verify
    const response = await axios.post(apiUrl, {
      md5: md5
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.BAKONG_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    // response.data usually contains { responseCode: 0, responseMessage: "Success", data: { ... } }
    res.json(response.data);
  } catch (error) {
    console.error('Verify error:', error.response?.data || error.message);
    // Even if it fails, send the error data back so frontend can handle it
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to verify transaction',
      details: error.response?.data || error.message
    });
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
  });
}

module.exports = app;

} catch (err) {
  const express = require('express');
  const app = express();
  app.all('*', (req, res) => res.status(500).send(err.stack || err.message));
  module.exports = app;
}
