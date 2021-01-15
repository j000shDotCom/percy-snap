if (!process.env.PERCY_BRANCH || !process.env.PERCY_TOKEN) {
  console.error('missing PERCY_BRANCH or PERCY_TOKEN');
  process.exit(1);
}

const PercyScript = require('@percy/script');
const httpServer = require('http-server');

PercyScript.run(async (page, percySnapshot) => {
  const port = process.env.PORT_NUMBER || 8000;
  const server = httpServer.createServer();
  server.listen(port);

  const args = process.argv.slice(2);
  const url = `http://localhost:${port}/${args[0] || process.env.PERCY_BRANCH}.html`;
  const numSnapshots = args[1] || 10;

  console.log(`running ${numSnapshots} snapshots on ${url}`)
  for(let i = 0; i < numSnapshots; ++i) {
    await page.goto(url);
    await percySnapshot(`Test ${i + 1}`, { widths: [1024] });
    // await page.waitFor(1000); // wait a second
  }

  server.close();
});
