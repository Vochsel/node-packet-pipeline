var dgram = require('dgram');

function createServer(a_host, a_port) {
    var server = dgram.createSocket('udp4');

    server.on('listening', function() {
        var address = server.address();
        console.log('UDP  Server listening on ' + address.address + ' : ' + address.port);
    });

    server.on('message', function(a_message, a_remote) {
        console.log('UDP Server message = ' + a_remote.address + ' : ' + a_remote.port + ' - ' + a_message);
    });

    server.bind(a_port, a_host);

    return server;
}

exports.createServer = createServer;