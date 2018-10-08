var path = require('path');
var chalk = require('chalk');
console.log('basename');
var filePath = "C:\\Users\\Administrator\\Downloads\\sivashanmugam\\code-sivashanmugam\\privado\\node-lab\\eventloop\\index.js";

console.log(chalk.yellow('BASENAME : returns file name alone from full directory'));
console.log(path.basename(filePath));

console.log(chalk.yellow('DIRNAME : returns directory name alone from full path'));
console.log(path.dirname(filePath));

console.log(chalk.yellow('EXTNAME : returns file extention alone from full path'));
console.log(path.extname(filePath));

console.log(chalk.yellow('DELIMITER : returns environment path variables which were set'));
console.log(process.env.path);
console.log(process.env.path.split(path.delimiter));

console.log(chalk.yellow('PARSE : returns object which contains details of the properties of a path'));
console.log(filePath.split(path.sep));

console.log(chalk.yellow('ISABSOLUTE : returns boolean mentions whether a path is abolute or not'));
console.log(path.isAbsolute(filePath));
console.log(path.isAbsolute('../node_modules'));