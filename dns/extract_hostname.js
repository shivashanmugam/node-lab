let psl = require('psl');
function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
    return hostname;
}

//test the code
console.log("== Testing extractHostname: ==");
console.log(psl.parse(extractHostname("http://www.blog.classroom.me.uk/index.php")).domain);
console.log(psl.parse(extractHostname("http://www.youtube.com/watch?v=ClkQA2Lb_iE")).domain);
console.log(psl.parse(extractHostname("https://www.youtube.com/watch?v=ClkQA2Lb_iE")).domain);
console.log(psl.parse(extractHostname("www.youtube.com/watch?v=ClkQA2Lb_iE")).domain);
console.log(psl.parse(extractHostname("ftps://ftp.websitename.com/dir/file.txt")).domain);
console.log(psl.parse(extractHostname("websitename.com:1234/dir/file.txt")).domain);
console.log(psl.parse(extractHostname("ftps://websitename.com:1234/dir/file.txt")).domain);
console.log(psl.parse(extractHostname("example.com?param=value")).domain);
console.log(psl.parse(extractHostname("https://facebook.github.io/jest/")).domain);
console.log(psl.parse(extractHostname("//youtube.com/watch?v=ClkQA2Lb_iE")).domain);
console.log(psl.parse(extractHostname("http://localhost:4200/watch?v=ClkQA2Lb_iE")).domain);
console.log((extractHostname("https://facebook.github.io/jest/"))); // bug https://github.com/lupomontero/psl/issues/88