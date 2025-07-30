// server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API route to fetch HTML from a target URL
app.get('/fetch-html', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0', // Some websites block requests without a user-agent
      }
    });
    if (!response.ok) {
      return res.status(500).send(`Failed to fetch URL, status: ${response.status}`);
    }
    const html = await response.text();
    res.send(html);
  } catch (err) {
    console.error('Error fetching URL:', err.message);
    res.status(500).send("Failed to fetch HTML");
  }
});

// Fallback: serve index.html for all other non-API routes (for SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
