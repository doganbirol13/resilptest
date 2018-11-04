// ===================================================
// FOR PRODUCTION
// Total.js - framework for Node.js platform
// https://www.totaljs.com
// ===================================================

// const options = {};

// // options.ip = '127.0.0.1';
// // options.port = parseInt(process.argv[2]);
// // options.config = { name: 'Total.js' };
// // options.sleep = 3000;

// require('total.js').http('release', options);
// // require('total.js').cluster.http(5, 'release', options);


var fs = require('fs');

var options = {};
options.https = {
   key: fs.readFileSync('/SSL/private.key'),
   cert: fs.readFileSync('/SSL/certificate.crt')
};
options.port = 8000;

require('total.js').https('release', options);