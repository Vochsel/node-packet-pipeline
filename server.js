var node_packet_pipeline_pkg = require('./package.json');
var cli_args = require('commander');

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
    var server = udp_server.createServer("localhost", PORT);
    
    // Create client
    //var client = udp_client.createClient("localhost", PORT);
    //client.sendMessage("Test");
}

main();