var fs = require('fs');
var path = require('path');

var pkg = require('../package.json');

var docsIndex = path.resolve(__dirname, '../docs/index.html');

fs.readFile(docsIndex, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/@@version/g, pkg.version);

  fs.writeFile(docsIndex, result, 'utf8', function (err) {
    if (err) return console.log(err);


    fs.readFile(docsIndex, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var header = '<title>Angular Gantt - Gantt chart component for AngularJS</title>\n'+
        '        <meta property="og:title" content="Angular Gantt" />\n'+
        '        <meta property="og:description" content="Gantt chart component for AngularJS" />\n'+
        '        <meta property="og:type" content="website" />\n'+
        '        <meta property="og:url" content="https://www.angular-gantt.com/" />\n'+
        '        <meta property="og:image" content="https://www.angular-gantt.com/img/angular-gantt.png" />'

      var result = data.replace(/<title>.*?<\/title>/g, header);

      fs.writeFile(docsIndex, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  });
});

