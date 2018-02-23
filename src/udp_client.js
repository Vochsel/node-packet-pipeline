var dgram = require('dgram');

var npp_types = require('./types');

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