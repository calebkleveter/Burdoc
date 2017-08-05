const fs = require('fs');

/**
 * Gets an HTML view from the views folder.
 *
 * @param {string} name: The name of the view to fetch.
 * @return The view's data converted to a string
 */
function getView (name) {
  let fileData = fs.readFileSync(`${__dirname}/views/${name}.html`, {encoding: 'utf8'});
  return fileData.toString();
}

module.exports.get = getView;
