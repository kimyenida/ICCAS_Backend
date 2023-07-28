const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3000 });

server.on("connection", (socket) => {
  console.log("Client connected");

  // 메시지 수신 시 처리
  socket.on("message", (message) => {
    console.log(`Received: ${message}`);
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Echo: ${message}`);
      }
    });
  });

  // 연결 종료 시 처리
  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on port 3000");
