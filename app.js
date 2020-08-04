//forks 
const { fork } = require('child_process');

n1 = fork('./api.js');             //start payment api 
n2 = fork('./pow.js');             //start powsolver 

