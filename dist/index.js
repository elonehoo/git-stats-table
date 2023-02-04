#!/usr/bin/env node

// index.js
var shell = require("shelljs");
var path = require("path");
var contributors = require(`${process.cwd()}/contributors.json`);
var User = class {
  author;
  email;
  commit;
  proportion;
  constructor(author, email, commit, proportion) {
    this.author = author;
    this.email = email;
    this.commit = commit;
    this.proportion = proportion;
  }
};
shell.exec('export _GIT_BRANCH="main"');
var text = shell.exec("git-quick-stats -V");
var json = text.stdout.replace(/^author,insertions,insertions_per,deletions,deletions_per,files,files_per,commits,commits_per,lines_changed,lines_changed_per\n/m, "").split("\n");
var items = [];
for (let item of json) {
  if (item !== "") {
    item = item.replace(/(^\s*)|(\s*$)/g, "");
    inin = replaceStr(item, item.indexOf("<") - 1, ",").split(",");
    items.push(
      new User(
        inin[0],
        inin[1].substring(1, inin[1].length - 1),
        inin[8],
        inin[9]
      )
    );
  }
}
var endValue = [];
for (let j = 0; j < contributors.length; j++) {
  for (let i = 0; i < contributors[j].email.length; i++) {
    for (let item of items) {
      if (item.email === contributors[j].email[i]) {
        if (i === 0) {
          endValue.push(item);
        } else {
          for (let end of endValue) {
            if (end.email === contributors[j].email[0]) {
              end.commit = parseInt(end.commit) + parseInt(item.commit) + "";
              end.proportion = parseInt(end.proportion) + parseInt(item.proportion) + "%";
            }
          }
        }
      }
    }
  }
}
function replaceStr(str, index, char) {
  return str.substring(0, index) + char + str.substring(index + 1);
}
console.table(endValue);
