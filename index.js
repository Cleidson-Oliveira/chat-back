import * as dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";

const PORT = process.env.PORT | 4000;

let onlineUsers = [];

const io = new Server(PORT, {
    cors: {
        origin: process.env.FRONT_URL
    }
});

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