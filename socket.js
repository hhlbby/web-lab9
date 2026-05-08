const { Server } = require('socket.io');

let activeClients = {};

module.exports = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        
        socket.on('join', ({ name, role }) => {
            socket.userData = { name, role };
            
            if (role === 'client') {
                socket.join(socket.id);
                activeClients[socket.id] = name;
                io.to('operators_room').emit('update_client_list', activeClients);
            } else if (role === 'operator') {
                socket.join('operators_room');
                socket.emit('update_client_list', activeClients);
            }
        });

        socket.on('message', ({ text, targetId }) => {
            if (!socket.userData) return;

            const payload = {
                sender: socket.userData.name,
                text: text,
                time: new Date().toLocaleTimeString(),
                clientId: socket.userData.role === 'client' ? socket.id : targetId
            };

            if (socket.userData.role === 'client') {
                io.to(socket.id).emit('receive_message', payload);
                io.to('operators_room').emit('receive_message', payload);
            } else if (targetId) {
                io.to(targetId).emit('receive_message', payload);
                socket.emit('receive_message', payload);
            }
        });

        socket.on('disconnect', () => {
            if (socket.userData && socket.userData.role === 'client') {
                delete activeClients[socket.id];
                io.to('operators_room').emit('update_client_list', activeClients);
            }
        });
    });

    return io;
};