//https://www.npmjs.com/package/require-context
var requireContext = require('require-context');

var cache = {};

function importAll(r) {
    console.log('resolving')

    r.keys().forEach(key => {
        cache[key] = r('../../require-context/src/'+key);
    });
}
importAll(requireContext("../../require-context/src", false, /\.js$/))
console.log(cache);
