var node_packet_pipeline_pkg = require('./package.json');
var cli_args = require('commander');

var npp_types = require('./src/types');


var udp_server = require('./src/udp_server');
var udp_client = require('./src/udp_client');

function main() {
    // Parse command line arguments
    cli_args.version(node_packet_pipeline_pkg.version)
        .option('-p, --port [port]', 'Server port', '3000')
        .parse(process.argv);

    // Store important variables
    var PORT = cli_args.port;

    // Create server
    var server = udp_server.createServer("10.0.0.29", PORT);
    
    // Create client
    var client = udp_client.createClient("10.0.0.29", PORT);
    client.sendMessage(npp_types.MESSAGE_TYPE.Connection, npp_types.MESSAGE_TYPE.SendReceive, "f");
    client.sendMessage(npp_types.MESSAGE_TYPE.Data, 0, "Test");
}

main();