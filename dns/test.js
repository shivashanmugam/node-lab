const dns = require('dns');
const psl = require('psl');
function reverseDNSLookup(ip) {
    return new Promise((resolve, reject) => {
        dns.lookupService(ip,22, (err, hostname, service) => {
            if (err) {
                reject(err);
            }
            resolve(psl.parse(hostname).domain);
        })
    })
}

reverseDNSLookup("66.249.66.1").then(function(host){
    console.log(host)
}).catch(function(err){
    console.log(err)
});

reverseDNSLookup("66.249.66.1111").then(function(host){
    console.log(host)
}).catch(function(err){
    console.log(err)
});