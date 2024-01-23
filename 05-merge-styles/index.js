const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, data) => {
    if (err) throw err;
    const bundle = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'bundle.css'),
    );

    for (const iterator of data) {
      if (iterator.isFile()) {
        const fileName = iterator.name;
        let extName = path.extname(fileName);
        extName = extName.substring(1);
        if (extName == 'css') {
          const input = fs.createReadStream(
            path.join(__dirname, 'styles', fileName),
            'utf-8',
          );
          input.on('data', (chunk) => bundle.write(chunk));
        }
      }
    }
  },
);
