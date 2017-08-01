const fs = require('fs');

function getView(name) {
  let fileData = fs.readFileSync(`${__dirname}/views/${name}.html`, {encoding: 'utf8'});
  return fileData.toString();
}

module.exports.get = getView;
