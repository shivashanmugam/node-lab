const { fork } = require('child_process');

const forked = fork('./fork_child.js');

forked.on('message', function(message){
  console.log(`CHILD : ${message}`);
})

forked.send('Tell me my dear child');