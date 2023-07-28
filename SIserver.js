const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("server started");
});

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    console.log("데이터 : %o", data);
    console.log("데이터 : %s", data);
    ws.send(data.toString());
  });
});

wss.on("listening", () => {
  console.log("server is listening on port 8080");
});
