const fs = require('fs');
const path = require('path');

//create folder

fs.readdir(path.join(__dirname), (err, data) => {
  if (err) throw err;
  let hasDir = false;
  for (const iterator of data) {
    if (iterator == 'project-dist') {
      hasDir = true;
    }
  }
  if (!hasDir) {
    fs.mkdir(path.join(__dirname, 'project-dist'), (err) => {
      if (err) throw err;
      console.log('Folder was created');
    });
  }

  // read template.html
  const templateStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  templateStream.on('data', readComponents);
});

function readComponents(mainTemplate) {
  fs.readdir(path.join(__dirname, 'components'), (err, components) => {
    if (err) throw err;
    const componentsPairs = new Map();
    let counter = 0;
    for (const iterator of components) {
      counter++;
      const componentStream = fs.createReadStream(
        path.join(__dirname, 'components', iterator),
        'utf-8',
      );
      componentStream.on('data', (chunk) => {
        const componentContent = chunk;
        const componentVariable = `{{${iterator.replace('.html', '')}}}`;
        componentsPairs.set(componentVariable, componentContent);
        counter--;
        if (counter == 0) {
          printHtml(componentsPairs, mainTemplate);
        }
      });
    }
  });
}

function printHtml(map, mainTemplate) {
  let replacedHtml = mainTemplate;
  for (const [key, value] of map) {
    replacedHtml = replacedHtml.replace(key, value);
  }
  const finalHtmlStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'index.html'),
  );

  finalHtmlStream.write(replacedHtml);
}

// styles
fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, data) => {
    if (err) throw err;
    const bundle = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'style.css'),
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

// assets
fs.readdir(path.join(__dirname), (err, data) => {
  if (err) throw err;
  const pathOrigDir = path.join(__dirname, 'assets');
  const pathTargetDir = path.join(__dirname, 'project-dist', 'assets');

  fs.rm(pathTargetDir, { recursive: true, force: true }, () => {
    copyDir(pathOrigDir, pathTargetDir);
  });
});

function copyDir(dirPath, targetDirPath) {
  fs.mkdir(targetDirPath, (err) => {
    if (err) throw err;

    fs.readdir(dirPath, (err, data) => {
      if (err) throw err;

      for (const iterator of data) {
        fs.stat(path.join(dirPath, iterator), (err, stats) => {
          if (err) {
            console.error(err);
            return;
          }
          const origPath = path.join(dirPath, iterator);
          const targetPath = path.join(targetDirPath, iterator);
          if (stats.isFile()) {
            fs.copyFile(origPath, targetPath, (err) => {
              if (err) throw err;
            });
          } else if (stats.isDirectory()) {
            copyDir(origPath, targetPath);
          }
        });
      }
    });
  });
}
