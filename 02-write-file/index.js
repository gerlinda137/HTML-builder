const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

stdout.write('Write down some of your current thoughts\n');
process.on('SIGINT', () => {
  stdout.write(
    'Thank you, all of your thoughts will be transfered to Tovarisch Mayor \n',
  );
  process.exit();
});

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err;
});
stdin.on('data', (data) => {
  const dataString = data.toString();
  if (dataString == 'exit\n' || dataString == 'exit\r\n') {
    stdout.write(
      'Thank you, all of your thoughts will be transfered to Tovarisch Mayor \n',
    );
    process.exit();
  }
  fs.appendFile(path.join(__dirname, 'text.txt'), data, (err) => {
    if (err) throw err;
    console.log('Anything else?');
  });
});
