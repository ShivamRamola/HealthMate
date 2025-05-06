// server.js

const WebSocket = require('ws');
const http = require('http');

// Define the port
const PORT = process.env.PORT || 3000;

// Create an HTTP server (optional, useful if deploying)
const server = http.createServer();

// Create a WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

let clients = [];

// Broadcast message to all connected clients except sender
function broadcast(sender, data) {
  clients.forEach(client => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on('connection', (ws) => {
  console.log('🔌 New client connected');
  clients.push(ws);

  ws.on('message', (message) => {
    console.log('📨 Message received:', message);
    // Broadcast signaling data to other peer
    broadcast(ws, message);
  });

  ws.on('close', () => {
    console.log('❌ Client disconnected');
    clients = clients.filter(client => client !== ws);
  });

  ws.on('error', (err) => {
    console.error('⚠️ WebSocket error:', err.message);
  });
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`✅ WebSocket signaling server running at ws://localhost:${PORT}`);
});
