const puppeteer = require('puppeteer');
const util = require('util');
const fs = require("fs");

(async () => {
  const url = process.argv.slice(2)[0];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.coverage.startCSSCoverage();
  await page.goto(url);
  const css_coverage = await page.coverage.stopCSSCoverage();
  console.log(util.inspect(css_coverage, { showHidden: false, depth: null }));
  await browser.close();

  let final_css_bytes = '';
  let total_bytes = 0;
  let used_bytes = 0;

  for (const entry of css_coverage) {
    final_css_bytes = "";

    total_bytes += entry.text.length;
    for (const range of entry.ranges) {
      used_bytes += range.end - range.start - 1;
      final_css_bytes += entry.text.slice(range.start, range.end) + '\n';
    }

    filename = entry.url.split('/').pop();

    fs.writeFile('./' + filename, final_css_bytes, error => {
      if (error) {
        console.log('Error creating file:', error);
      } else {
        console.log('File saved');
      }
    });
  }
})();
