// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // serve frontend from public/

// Route to fetch raw HTML from a URL
app.get('/fetch-html', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await fetch(url);
    const html = await response.text();
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch HTML");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
