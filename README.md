# erddap4js - ERDDAP JavaScript interface for the browser & Node

Simple ERDDAP library for JS, written in TypeScript. Works in Node or the browser. Supports tabledap and griddap JSON queries.

## Quickstart

### Browser example

See a demo in demo/browser/index.html

Put the dist/browser/ERDDAP.js in the same folder with your HTML file.

```html
<script src="ERDDAP.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", async function () {
    const erddapServer = new ERDDAP("https://coastwatch.pfeg.noaa.gov/erddap");

    // list datasets
    const datasets = await erddapServer.allDatasets();

    // basic query via URL
    const data = await erddapServer.queryURL(
      "/tabledap/erdCinpKfmSFNH.json?id,size&time>=2007-06-24T00:00:00Z"
    );

    const tableData = await erddapServer.tabledap({
      dataset: "erdCinpKfmSFNH",
      variables: ["id", "size"],
      constraints: [["time", ">=", "2007-06-24T00:00:00Z"]],
    });

    const gridData = await erddapServer.griddap({
      dataset: "jplAmsreSstMon_LonPM180",
      time: ["2010-12-16T12:00:00Z", "2010-12-16T12:00:00Z"],
      lat: [50, 50],
      long: [-150, -120],
      variables: ["tos", "tosNobs", "tosStderr"],
    });

    const metadata = await erddapServer.info("erdCinpKfmSFNH");

    console.log(datasets);
  });
</script>
```

### Node example

The import is different, the rest is the same as the browser example above.

```js
const ERDDAP = require("dist/node/ERDDAP").default;
```

See a demo in demo/node/runQuery.js

## Methods

- `ERDDAP()`
- `allDatasets()`
- `info()`
- `queryURL()`
- `tabledap()`
- `griddap()`

## CORS

Lots of ERDDAP servers won't support CORS, so you may run into this issue while trying to use ERDDAP in your browser. If your website that queries ERDDAP isn't on the same web server as ERDDAP then you wil need to [enable CORS](https://enable-cors.org/server.html) on your server.

## Development

To build the package for node and the browser, run

`npm run build`

## Tests & coverage

- `npm test` to run tests
- `npm run coverage` - to build a folder 'coverage' to see coverage reports in your browser
