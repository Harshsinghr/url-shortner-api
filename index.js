require('dotenv').config();
const express = require('express');
const urlRoute = require('./routes/url');
const rateLimit = require('express-rate-limit');
const { connectToMongoDB } = require('./connect');

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});
app.use(limiter);

connectToMongoDB(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/url', urlRoute);

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));