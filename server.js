var node_packet_pipeline_pkg = require('./package.json');
var cli_args = require('commander');

var npp_types = require('./src/types');


var udp_server = require('./src/udp_server');
var udp_client = require('./src/udp_client');

function main() {
    // Parse command line arguments
    cli_args.version(node_packet_pipeline_pkg.version)
        .option('-p, --port [port]', 'Server port', '3000')
        .option('-s, --server', 'Is Server')
        .option('-c, --client', 'Is Client')
        .parse(process.argv);

    // Store important variables
    var PORT = cli_args.port;

    if(cli_args.server) {
        // Create server
        var server = new udp_server("10.0.0.29", PORT);
    }
}

main();