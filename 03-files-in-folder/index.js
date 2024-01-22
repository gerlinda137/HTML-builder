const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, data) => {
    if (err) throw err;
    for (const iterator of data) {
      let string = '';
      if (iterator.isFile()) {
        const fileName = iterator.name;
        let extName = path.extname(fileName);
        extName = extName.substring(1);
        const rawName = fileName.substring(
          0,
          fileName.length - (extName.length + 1),
        );
        let size = '';

        fs.stat(
          path.join(__dirname, 'secret-folder', fileName),
          (err, stats) => {
            if (err) {
              console.error(err);
            }
            size = `${stats.size / 1000}kb`;
            string += `${rawName} - ${extName} - ${size}`;
            console.log(string);
          },
        );
      }
    }
  },
);
