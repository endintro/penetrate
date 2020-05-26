const PCAPNGParser = require('pcap-ng-parser')
const pcapNgParser = new PCAPNGParser()

process.stdin.pipe(pcapNgParser)
    .on('data', parsedPacket => {
        console.log(parsedPacket)
    })
    .on('interface', interfaceInfo => {
        console.log(interfaceInfo)
    })