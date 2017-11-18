const { send } = require('micro');
const phantom = require('phantom');

const delay = (t) =>
  new Promise((resolve) => setTimeout(resolve, t));

module.exports = async (req, res) => {
  const instance = await phantom.create();
  const page = await instance.createPage();

  await page.property('viewportSize', { width: 1366, height: 600 });
  await page.property('content', `<html>
    <head>
      <style>
        body {
          background: blue;
        }
        div {
          font-family: 'Muli';
        }
      </style>
      <link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet">
    </head>
    <body>
      <span>Teste</span>
      <div style="color: red; font-size: 80px; text-align: center; padding-top: 230px; height: 1200px;">
        HelloWorld.png
      </div>
    </body>
  </html>`);

  // TODO: need to found a better way to do it...
  await delay(200);
  const base64 = await page.renderBase64('png', 50);
  await instance.exit();

  res.setHeader('Content-Type', 'image/png');
  send(res, 200, new Buffer(base64, 'base64'));
};
