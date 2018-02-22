var dgram = require('dgram');

var nppTypes = require('./types');

function createClient(a_host, a_port) {
    var client = dgram.createSocket('udp4');

    client.on('message', function(a_message, a_remote) {
        console.log('Client received: ' + a_message);
    });

    return {
        client: client,
        sendMessage: function(a_type, a_typeData, a_message, a_shouldClose = false) {
            var buffer = Buffer.from(a_message, 2);
            //buffer.copy(a_message, 2, 0, a_message.length);
            buffer[0] = a_type;
            buffer[1] = a_typeData;

            //console.log(buffer);

            this.client.send(a_message, a_port, a_host, function(a_err, a_bytes) {
                if(a_err) throw a_err;
                
                console.log('UDP Server message sent to ' + a_host + ' : ' + a_port);

                if(a_shouldClose) client.close();
            })
        }
    };
}

exports.createClient = createClient;