# svgs2pdf

forked from [svg2pdf-cli](https://github.com/vowstar/svg2pdf-cli/)

A command-line tool for rendering multiple SVG images to multiple or a single PDF file

## Installation

svgs2pdf can be installed from NPM using:

```bash
npm install -g svgs2pdf
```

## Features

* Support single or multiple SVG file input
* Support setting SVG size (width and height), NOTE: This option only can change the svg image size on the PDF page, but can't set PDF page size.
* Support single or multiple PDF file output. When multiple SVG files are provieded single pdf output requires `pdftk` binary installed

Because svgs2pdf uses Chromium to render the svg, it only supports these formats:

Format  |       size
------- | ----------------
Letter  | 8.5in x 11in
Legal   | 8.5in x 14in
Tabloid | 11in x 17in
Ledger  | 17in x 11in
A0      | 33.1in x 46.8in
A1      | 23.4in x 33.1in
A2      | 16.54in x 23.4in
A3      | 11.7in x 16.54in
A4      | 8.27in x 11.7in
A5      | 5.83in x 8.27in
A6      | 4.13in x 5.83in

## Useage

```bash
Usage: svgs2pdf [options] <svg1> ...
Options:
      --help        Show help                                          [boolean]
      --version     Show version number                                [boolean]
  -w, --width       Set width of PDF, allowed units: %, px
  -h, --height      Set height of PDF, allowed units: %, px
  -f, --format      Set format of PDF, allowed options: Letter, Legal, Tabloid,
                    Ledger, A0, A1, A2, A3, A4, A5, A6
  -o, --output-dir  Set the output directory for pdf file(s)
  -m, --merge-file  Set the filename for a single pdf cointaining each svg as a
                    page (requires pdftk)

e.g.: svgs2pdf source1.svg
e.g.: svgs2pdf source1.svg source2.svg source3.svg
e.g.: svgs2pdf -w 100px -h 100px source.svg
e.g.: svgs2pdf -w 100px -h 100px -f A4 --output-dir /tmp source1.svg
e.g.: svgs2pdf -m combined-pdf.pdf source1.svg  source2.svg
```
