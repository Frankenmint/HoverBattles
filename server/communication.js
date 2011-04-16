io = require('socket.io');
HovercraftFactory = require('../shared/hovercraftfactory').HovercraftFactory;

ServerCommunication = function(app, server){
  this.server = server;
  this.app = app;
  this.socket = io.listen(server); 
  this.clients = {};
  
  var server = this;  
  this.socket.on('connection', function(socket) { server.onConnection(socket); });
};

ServerCommunication.prototype.onConnection = function(socket){
    this.clients[socket.sessionId] = socket;
    this.hookClientEvents(socket);
};

ServerCommunication.prototype.hookClientEvents = function(socket) {
    var server = this;
    socket.on('message', function(msg) { server.dispatchMessage(socket, msg); });    
    socket.on('disconnect', function() {server.unhookClient(socket);});
};

ServerCommunication.prototype.dispatchMessage = function(socket, msg) {
  var handler = this['_' + msg.command];
  handler.call(this, socket, msg.data);  
};

ServerCommunication.prototype.sendMessage = function(socket, command, data){
  socket.send({
      command: command,
      data: data      
  });
};

ServerCommunication.prototype.broadcast = function(command, data, from) {
  for(i in this.clients){
      if(from && this.clients[i] === from) continue;
      this.sendMessage(this.clients[i], command, data);   
  }
};

ServerCommunication.prototype.unhookClient = function(socket) {
    this.removePlayer(socket);
    delete this.clients[socket.sessionId];  
};

ServerCommunication.prototype.removePlayer = function(socket) {
    if(socket.craft){
       this.scene.removeEntity(socket.craft);   
    }
    
    // Inform all connected clients that this has happened
};

ServerCommunication.prototype._ready = function(socket, data) {
    var factory = new HovercraftFactory(this.app);
    socket.craft = factory.create(socket.sessionId);
    this.app.scene.addEntity(socket.craft);

    // Tell the player to create its own craft
    this.sendMessage(socket, 'start', {
       id: socket.sessionId,
       position: socket.craft.position,
       velocity: socket.craft._velocity
    });
    
    // Tell the player about the rest of the scene
    for(i in this.clients) {
        var client = this.clients[i];
        if(client == socket) continue;
        
        this.sendMessage(socket, 'addplayer', {
           id: client.sessionId,
           position: client.craft.position,
           velocity: client.craft._velocity
        });
    }

    // Tell everybody else that this player has joined the party
    this.broadcast('addplayer', {
       id: socket.sessionId,
       position: socket.craft.position,
       velocity: socket.craft._velocity
    },
    socket);
};

exports.ServerCommunication = ServerCommunication;