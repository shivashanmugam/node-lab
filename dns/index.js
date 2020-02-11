const dns = require('dns');
let psl = require('psl');
const hostname = "crawl-66-249-66-1.googlebot.com";

// DNS look up
dns.lookup(hostname, (err, address, family) => {
    console.log('address: %j family: IPv%s', address, family);

    // DNS reverse lookup
    dns.lookupService(address, 22,(err, hostname, service) => {
        console.log(psl.parse(hostname).domain)
    })
});
