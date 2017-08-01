const fs = require('fs');

function getView(name) {
  let fileData = fs.readFileSync(`./views/${name}.html`, {encoding: 'utf8'});
  return fileData.toString();
}

module.exports.get = getView;
