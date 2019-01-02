const dns = require('dns');
const address = "66.249.66.1";

// DNS look up
dns.lookup(hostname, (err, address, family) => {
    console.log('address: %j family: IPv%s', address, family);

    // DNS reverse lookup
    dns.lookupService(address, 22, (err, hostname, service) => {
        console.log(hostname, service);
    }); 
});
