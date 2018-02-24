var dgram = require('dgram');

var UDPSocket = require("./udp_socket");
var TYPES = require('./types');

class UDPClient extends UDPSocket {

    // Overide Socket constructor
    constructor(a_clientType, a_remote = null) {
        super();

        // Type of client
        this.clientType = a_clientType;

        // Client has specific remote address
        this.remoteConnection = a_remote;
    }

    // Overide Socket listening function
    onListening() {
        console.log("Client listening!");
    }

    // Overide Socket receive function
    onReceivePacket(a_buffer, a_remote) {
        super.onReceivePacket(a_buffer, a_remote);

        // Get message type
        var messageType = a_buffer[0];

        // Get remainder buffer data
        var bufferData = a_buffer.toString('utf8', 1);

        // Log out helpful packet message
        console.log("Received message type %s. Data: %s", Object.keys(TYPES.MESSAGES)[messageType], bufferData);

        switch(messageType) {
            // Message is raw data
            case TYPES.MESSAGES.Data:
            {
                // If no listening clients, break
                if(this.listeningClients.length === 0) break;

                // Loop through listening clients and forward data
                for(var client of this.listeningClients) {
                    // Forward packet to listening client
                    this.sendPacket(bufferData, client);
                }
            }
            break;
        }
    }
};

module.exports = UDPClient;

function createClient(a_remote, a_remotePort) {
    console.log("Creating client");
    var client = {
        connection: dgram.createSocket('udp4'),
        sendMessage: function(a_type, a_typeData, a_message, a_shouldClose = false) {
            //buffer.copy(a_message, 2, 0, a_message.length);
            var typeBuffer = new Buffer([a_type, a_typeData]);
            var buffer = Buffer.concat([typeBuffer, Buffer.from(a_message)]);

            //console.log(buffer);

            this.connection.send(buffer, a_remotePort, a_remote, function(a_err, a_bytes) {
                if(a_err) throw a_err;
                
                console.log('UDP Server message sent to ' + a_remote + ' : ' + a_remotePort);

                if(a_shouldClose) this.connection.close();
            })
        }
    };

    client.connection.on('listening', function() {
        var address = client.connection.address();

        var conn_id = address.address + ":" + address.port;

        console.log("UDP Client Created: " + conn_id);

        // Send connection message
        client.sendMessage(npp_types.MESSAGE_TYPE.Connection, npp_types.CLIENT_TYPE.Send, conn_id);

        var stdin = process.openStdin();

        stdin.addListener("data", function(d) {
            var input = d.toString().trim();
            client.sendMessage(npp_types.MESSAGE_TYPE.Data, 0, input);
        });
    });


    client.connection.on('message', function(a_message, a_remote) {
        console.log('Client received: ' + a_message);
    });

    client.connection.bind();

    return client;
}

exports.createClient = createClient;