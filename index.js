import * as dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT | 4000;

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONT_URL
    }
});

let onlineUsers = [];

io.on("connection", (socket) => {
    
    socket.on("register user", (data) => {
        onlineUsers.push({
            id: socket.id,
            name: data.name
        })

        io.emit("online users", onlineUsers);
    })

    socket.on("message", (data) => {
        io.to(data.to).emit("message", {data});
    })
    
    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.id != socket.id);
        io.emit("online users", onlineUsers);
    });

});

httpServer.listen(PORT)