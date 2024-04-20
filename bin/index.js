#!/usr/bin/env node

const shell = (cmd) => execSync(cmd, { encoding: 'utf8' });

function executableIsAvailable(name){
    try {
        shell(`which ${name}`);
        return true;
    } catch (error) {
        return false;
    }
}

const puppeteer = require('puppeteer');
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const argv = require('yargs')
  .usage(
    'Usage: svg2pdf [options] <source svg> ...\n')
  .alias('w', 'width')
  .describe('w', 'Set width of PDF, allowed units: %, px')
  .alias('h', 'height')
  .describe('h', 'Set height of PDF, allowed units: %, px')
  .alias('f', 'format')
  .describe('f', 'Set format of PDF, allowed options: Letter, Legal, Tabloid, Ledger, A0, A1, A2, A3, A4, A5, A6')
  .alias('o', 'output-dir')
  .describe('o', 'Set the output directory for pdf file(s)')
  .alias('m', 'merge-file')
  .describe('m', 'Set the filename for a single pdf cointaining each svg as a page (requires pdftk)')
  .demandCommand(1)
  .parse();

var outDir;
var widthStr;
var heightStr;
var mergePdf;

if (argv.o) {
    outDir = argv.o;
} else {
    outDir = '.';
}
if (argv.w) {
    widthStr = 'width="' + argv.w + '"';
} else {
    widthStr = 'width=100%"';
}
if (argv.h) {
    heightStr = 'height="' + argv.h + '"';
} else {
    heightStr = '';
}
if (argv.f) {
    formatStr = argv.f;
} else {
    formatStr = 'A4';
}
if (argv._.length > 1 && argv.m) {
    if (!executableIsAvailable('pdftk')) {
        console.error('Merging multiple svg files into a single pdf requires pdftk installed');
        process.exit(-1);
    }
    mergePdf = argv.m;
}

(async () => {
    const browser = await puppeteer.launch({
      args: ['--disable-dev-shm-usage', '--no-sandbox', '--allow-file-access-from-files', '--enable-local-file-accesses']
    });
    const page = await browser.newPage();
    const outputPdfs = [];

    for (var svgFile of argv._) {
        const pdfFile = path.resolve(path.join(outDir, path.basename(svgFile, '.svg') + '.pdf'));
        try {
            var svgCode = fs.readFileSync(svgFile, 'utf8');
            var svgBase64 = new Buffer.from(svgCode).toString('base64');

            const content = '<img ' + widthStr + ' ' + heightStr + ' src="data:image/svg+xml;base64,' + svgBase64 + '" />';
            await page.setContent(content, {waitUntil: 'domcontentloaded'});
            await page.pdf({path: pdfFile, format: formatStr});
        } catch (e) {
            console.error(e);
        }
        outputPdfs.push(pdfFile);
    }

    await browser.close();

    if (mergePdf) {
        const mergedFile = path.resolve(path.join(outDir, mergePdf));
        const options = outputPdfs.concat(['cat', 'output', mergedFile]);
        const child = spawnSync('pdftk', options);
        for (var pdfFile of outputPdfs) {
            fs.unlinkSync(pdfFile);
        }
        console.log(`${mergedFile} generated.`);
    } else {
        for (var pdfFile of outputPdfs) {
            console.log(`${pdfFile} generated.`);
        }
    }

})();
