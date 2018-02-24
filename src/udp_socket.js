// Requirements
var dgram = require("dgram");

// Class definition
class UDPSocket {

    // -- Constructor

    // UDPSocket Wrapper Constructor
    constructor(a_address = "127.0.0.1", a_port = 0) {
        // Create UDP Socket
        this.socket = dgram.createSocket('udp4');

        // Create containers for address and port
        this.address    = a_address;
        this.port       = a_port;

        // -- Socket Callbacks

        // On Listening
        this.socket.on("listening", () => {
            // Socket successfully listening

            // Rebind address and port incase automatically bound
            this.address    = this.socket.address().address;
            this.port       = this.socket.address().port;

            console.log("Socket bound to [%s:%s]", this.address, this.port);

            // Call UDPSocket Listening callback
            this.onListening();
        });

        // On Message
        this.socket.on("message", (a_buffer, a_remote) => {
            this.onReceivePacket(a_buffer, a_remote);
        });

        // On Error
        this.socket.on("error", (a_err) => {
            this.onError(a_err);
        })

        // Bind socket to specified address and port
        this.socket.bind(this.port, this.address);
    }

    // -- UDP Socket Callbacks

    // On successfully listening
    onListening() { }

    // Receive Packet from Remote
    onReceivePacket(a_buffer, a_remote) { }

    // Socket Error
    onError(a_err) {
        console.error("UDPSocket error: %s", a_err);
    }

    // -- UDP Helper Function

    // Send Packet to remote
    sendPacket(a_buffer, a_remote) {
        // Send packet to remote
        this.socket.send(a_buffer, a_remote.port, a_remote.address, function(a_err, a_bytes) {
            if(a_err) throw a_err;
            
            //console.log('UDP Server message sent to %s : %s = %s', a_remote.address, a_remote.port, a_buffer);
        });
    }

};

// Node export
module.exports = UDPSocket;