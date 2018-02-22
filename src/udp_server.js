var dgram = require('dgram');
var npp_types = require('./types');

var connections = new Map();

function createServer(a_host, a_port) {
    var server = dgram.createSocket('udp4');

    server.on('listening', function() {
        var address = server.address();
        console.log('UDP  Server listening on ' + address.address + ' : ' + address.port);
    });

    server.on('message', function(a_message, a_remote) {

        var msgType = a_message[0];
        var typeData = a_message[1];
        var msgData = a_message.slice(2);
        //console.log(msgType);

        var conn_id = a_remote.address + ':' + a_remote.port;
       // console.log("Message got");
        switch(msgType) {
            case npp_types.MESSAGE_TYPE.Data:
                //console.log("Data received");
                
                connections.forEach(a_conn => {
                    //TODO: Fix this
                    console.log(msgData);
                    server.send(msgData, a_conn.lport, a_conn.remote.address, function(a_err, a_bytes) {
                        if(a_err) throw a_err;
                        
                        console.log('UDP Server message sent to ' + a_host + ' : ' + a_conn.lport);
                    });
                });
                break;

            case npp_types.MESSAGE_TYPE.Connection:
                console.log("New connection");

                // Switch based on connection type
                switch(typeData) {
                    case npp_types.CLIENT_TYPE.Send:
                    break;
                    case npp_types.CLIENT_TYPE.SendReceive:
                    case npp_types.CLIENT_TYPE.Receive:
                    connections.set(conn_id, {remote: a_remote, lport: 3001});
                    break;
                }

                break;
        }

        console.log('UDP Server message = ' + a_remote.address + ' : ' + a_remote.port + ' - ' + a_message);
    });

    server.bind(a_port, a_host);

    return {
        server: server
    };
}

exports.createServer = createServer;