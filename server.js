import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: true
});

app.get('/', (req, res) => {
  console.log('hello world');
  res.send('Hello World');
});
// WebSocket connection for signaling
io.on("connection", (socket) => {
  console.log(socket.id, "a user connected");

  socket.emit("me", socket.id);

  socket.on("offer", (offer) => {
    console.log(offer);
    // Send offer to all users except the caller
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    // Send answer back to the original caller
    console.log(answer);
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    // Send ICE candidate to the other peer
    console.log(candidate);
    socket.broadcast.emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
