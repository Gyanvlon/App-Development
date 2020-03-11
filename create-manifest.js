const fs = require('fs');

const appName = process.argv[2];
const appDescription = process.argv[3];
const appVersion = process.argv[4];

if (appName) {
  fs.readFile('src/manifest.webapp', function(err) {
    if (err) {
      const manifestFileContent = {
        "version": appVersion || "0.0.0",
        "name": appName,
        "description": appDescription || appName,
        "launch_path": "index.html",
        "icons": {
          "16": "assets/img/icon-16x16.png",
          "48": "assets/img/icon-48x48.png",
          "128": "assets/img/icon-128x128.png"
        },
        "developer": {
          "name": "HISPTZ",
          "url": "https://hisptanzania.org"
        },
        "default_locale": "en",
        "activities": {
          "dhis": {
            "href": "../../../"
          }
        }
      };

      fs.writeFile('src/manifest.webapp', JSON.stringify(manifestFileContent),
        'utf-8', function (err) {
          if (err) {
            console.error(err)
          } else {
            console.info('Info: Manifest file created');
          }
        });

    } else {
      console.warn('Warning: Manifest file already exist')
    }
  })

} else {
  console.error('Error: Application name was not specified, try again')
}
