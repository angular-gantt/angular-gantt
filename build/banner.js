var pkg = require('../package.json');

module.exports = `Project: ${pkg.name} v${pkg.version} - ${pkg.description}
Authors: ${pkg.author}, ${pkg.contributors}
License: ${pkg.license}
Homepage: ${pkg.homepage}
Github: ${pkg.repository.url}`;
