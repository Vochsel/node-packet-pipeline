var dgram = require('dgram');

function createClient(a_host, a_port) {
    var client = dgram.createSocket('udp4');

    return {
        client: client,
        sendMessage: function(a_message, a_shouldClose = false) {
            this.client.send(a_message, a_port, a_host, function(a_err, a_bytes) {
                if(a_err) throw a_err;
                
                console.log('UDP Server message sent to ' + a_host + ' : ' + a_port);

                if(a_shouldClose) client.close();
            })
        }
    };
}

exports.createClient = createClient;