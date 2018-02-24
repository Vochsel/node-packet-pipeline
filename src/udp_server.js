var dgram = require('dgram');

var UDPSocket = require("./udp_socket");
var TYPES = require('./types');

class UDPServer extends UDPSocket {

    // Overide Socket constructor
    constructor(a_address = "127.0.0.1", a_port = 0) {
        super(a_address, a_port);

        // Storage of listening clients
        this.listeningClients = new Array();
    }

    // Overide Socket listening function
    onListening() {
        console.log("Server listening!");
    }

    // Overide Socket receive function
    onReceivePacket(a_buffer, a_remote) {
        super.onReceivePacket(a_buffer, a_remote);

        // Get message type
        var messageType = a_buffer[0];

        // Get remainder buffer data
        var bufferDataString = a_buffer.toString('utf8', 1, a_buffer.length);

        // Log out helpful packet message
        console.log("Received message type %s. Data: %s", Object.keys(TYPES.MESSAGES)[messageType], bufferDataString);

        switch(messageType) {
            // Message is raw data
            case TYPES.MESSAGES.Data:
            {
                // If no listening clients, break
                if(this.listeningClients.length === 0) break;
                
                // Loop through listening clients and forward data
                for(var client of this.listeningClients) {
                    // Forward packet to listening client
                    this.sendPacket(a_buffer, client);
                }
            }
            break;

            // Message is client connection
            case TYPES.MESSAGES.Connection:
            {
                // Get connected client type
                var clientType = a_buffer[1];

                // If client registers as receiver, store in active connections
                if(clientType === TYPES.CLIENTS.SendReceive || clientType === TYPES.CLIENTS.Receive) {
                    this.listeningClients.push(a_remote);
                }
            }
            break;

            // Message is client disconnection
            case TYPES.MESSAGES.Disconnection:
            {
                // Loop through listening clients and remove if found
                for(var i = 0; i < this.listeningClients.length; i++) {
                    if(this.listeningClients[i] === a_remote) {
                        // Found client, splice, early exit
                        this.listeningClients.splice(i, 1);
                        break;
                    }
                }
            }
            break;
        }
    }
};

module.exports = UDPServer;