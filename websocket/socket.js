const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const messageHandler = require('./handlers');

const clients = new Map(); // Maps userId => ws connection

function  setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const token = params.get('token');
    // console.log(token)
    if (!token) return ws.close(1008, 'Missing token');
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return ws.close(1008, 'Invalid token');
      debugger
      ws.user = user;
      clients.set(user.id, ws);
       if (clients.size === 2) {
        const clientArray = Array.from(clients.values());
        const [user1Ws, user2Ws] = clientArray;
        user1Ws.send(JSON.stringify({ type: 'init', receiverId: user2Ws.user.id }));
        user2Ws.send(JSON.stringify({ type: 'init', receiverId: user1Ws.user.id }));
      }

      ws.on('message', (data) => {
        messageHandler.handleMessage(ws, data, clients);
      });

      ws.on('close', () => {
        console.log(`User ${user.username} disconnected`);
        clients.delete(user.id);
      });
    });
  });
}

module.exports = setupWebSocket;
