import express from 'express'
import { WebSocketServer, WebSocket } from 'ws'
import http from 'http'

const app = express()
const port = process.env.PORT || 8080;


app.get('/', (req, res) => {
  res.send('WebSocket server is running');
});

// Create HTTP server separately
const httpServer = http.createServer(app);

// Handle upgrade requests explicitly
httpServer.on('upgrade', (request, socket, head) => {
  console.log('Upgrade request received');
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please try a different port or close the other application.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

const wss = new WebSocketServer({ noServer: true });

console.log('WebSocket server is initialized');

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  console.log(`New client connected from ${ip}`);
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    console.log('Received message:', data.toString());
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send('Hello! Message From Server!!');
});