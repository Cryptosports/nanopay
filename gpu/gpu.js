const os = require('os');
const shell = require('shelljs');

console.log('GPU POW STARTED')

if(os.platform() === 'win32'){
console.log('Windows OS')
shell.exec('"gpu/nano-work-server.exe" --gpu 0:0 -l 127.0.0.1:2883')
}else{
console.log('Linux')
shell.exec('"gpu/nano-work-server" --gpu 0:0 -l 127.0.0.1:2883')
}
