const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, data) => {
    if (err) throw err;
    fs.stat(
      path.join(__dirname, 'project-dist', 'bundle.css'),
      function (err, stat) {
        if (err == null) {
          for (const iterator of data) {
            if (iterator.isFile()) {
              const fileName = iterator.name;
              let extName = path.extname(fileName);
              extName = extName.substring(1);
              if (extName == 'css') {
                fs.readFile(
                  path.join(__dirname, 'styles', fileName),
                  'utf-8',
                  (err, fileContent) => {
                    if (err) throw err;
                    fs.appendFile(
                      path.join(__dirname, 'project-dist', 'bundle.css'),
                      fileContent,
                      (err) => {
                        if (err) throw err;
                      },
                    );
                  },
                );
              }
            }
          }
        } else if (err.code === 'ENOENT') {
          // file does not exist
          fs.writeFile(
            path.join(__dirname, 'project-dist', 'bundle.css'),
            '',
            (err) => {
              if (err) throw err;
              for (const iterator of data) {
                if (iterator.isFile()) {
                  const fileName = iterator.name;
                  let extName = path.extname(fileName);
                  extName = extName.substring(1);
                  if (extName == 'css') {
                    fs.readFile(
                      path.join(__dirname, 'styles', fileName),
                      'utf-8',
                      (err, fileContent) => {
                        if (err) throw err;
                        fs.appendFile(
                          path.join(__dirname, 'project-dist', 'bundle.css'),
                          fileContent,
                          (err) => {
                            if (err) throw err;
                          },
                        );
                      },
                    );
                  }
                }
              }
            },
          );
        }
      },
    );
  },
);
