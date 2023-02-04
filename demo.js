#!/usr/bin/env node
var shell = require('shelljs');

var text = shell.exec('git-quick-stats -T')

console.log(text)
