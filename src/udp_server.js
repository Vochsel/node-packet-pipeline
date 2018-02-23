var dgram = require('dgram');
var npp_types = require('./types');

var connections = new Map();

function createServer(a_host, a_port) {
    var server = dgram.createSocket('udp4');

    server.on('listening', function() {
        var address = server.address();
        console.log('UDP Server listening on ' + address.address + ' : ' + address.port);
    });

    server.on('message', function(a_message, a_remote) {
        var msgType = a_message[0];
        var typeData = a_message[1];
        var msgData = a_message.toString('utf8', 2);

        console.log("Message type: " + msgType + " - " + Object.keys(npp_types.MESSAGE_TYPE)[msgType]);
        console.log("Type data: " + typeData + " - " + Object.keys(npp_types.CLIENT_TYPE)[typeData]);
        console.log("Message data: " + msgData);

        var conn_id = a_remote.address + ':' + a_remote.port;

        switch(msgType) {
            case npp_types.MESSAGE_TYPE.Data:
                //console.log("Data received");
                console.log("Sending message to " + connections.size + " connections.");
                
                connections.forEach(a_conn => {
                    //TODO: Fix this
                    console.log(msgData);
                    server.send(msgData, a_conn.port, a_conn.address, function(a_err, a_bytes) {
                        if(a_err) throw a_err;
                        
                        console.log('UDP Server message sent to ' + a_host + ' : ' + a_conn.port);
                    });
                });
                break;

            case npp_types.MESSAGE_TYPE.Connection:
                console.log("New connection: " + conn_id);
                // Switch based on connection type
                switch(typeData) {
                    case npp_types.CLIENT_TYPE.Send: break;

                    case npp_types.CLIENT_TYPE.SendReceive:
                    case npp_types.CLIENT_TYPE.Receive:
                        console.log("Addin to connections");
                        connections.set(conn_id, {address: a_remote.address, port: a_remote.port});
                    break;
                }

                break;
        }

    });

    server.bind(a_port, a_host);

    return {
        server: server
    };
}

exports.createServer = createServer;