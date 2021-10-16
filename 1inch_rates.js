var request = require('request');

const openvpnmanager = require('node-openvpn');
 
const opts = {
  host: '10.8.0.1', // normally '127.0.0.1', will default to if undefined
  port: 1194, //port openvpn management console
  timeout: 1500, //timeout for connection - optional, will default to 1500ms if undefined
  logpath: 'log.txt' //optional write openvpn console output to file, can be relative path or absolute
};
const auth = {
  user: '',
  pass: '',
};
const openvpn = openvpnmanager.connect(opts)
 
// will be emited on successful interfacing with openvpn instance
openvpn.on('connected', () => {
  openvpnmanager.authorize(auth);
});



request('https://api.1inch.exchange/v3.0/137/tokens',
 function (error, response, body) {
  console.log('Status:', response.statusCode);
  console.log('Headers:', JSON.stringify(response.headers));
  console.log('Response:', body);
});