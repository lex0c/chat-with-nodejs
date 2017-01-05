var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
 
// Cliente list.
var clients = {};
 
// Route root.
app.get("/", function(req, res){
    res.send("server is running...");
});
 
/*
 * Dispara cada vez que um cliente se conecta ao socket
 * 
 * Disparado quando o cliente entrar no servidor, adicionando o 
 * id do cliente no array e emitindo dois novos eventos, nomeando-os de update.
*/
io.on("connection", function (client) {  
    client.on("join", function(name){
    	console.log("Joined: " + name);
        clients[client.id] = name;
        client.emit("update", "You have connected to the server.");
        client.broadcast.emit("update", name + " has joined the server.")
    });

    // ...
    client.on("send", function(msg){
    	console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    // ...
    client.on("disconnect", function(){
    	console.log("Disconnect");
        io.emit("update", clients[client.id] + " has left the server.");
        delete clients[client.id];
    });
    
});
 
// Server
http.listen(3000, function(){
    console.log("listening on port '3000'.");
});
