# ERDDAP4JS - Browser/Node interface for ERDDAP

Simple ERDDAP library for JS, written in TypeScript. Works in Node or the browser. Only supports tabledap JSON queries.

## Quickstart

### Browser Example

See a demo in demo/browser/index.html

Put the dist/browser/ERDDAP.js in the same folder with your HTML file.

```html
<script src="ERDDAP.js"></script>
```

```javascript
document.addEventListener("DOMContentLoaded", async function() {

    const erddapServer = new ERDDAP("https://coastwatch.pfeg.noaa.gov/erddap");

    // list datasets
    const datasets = await erddapServer.listDatasets();

    // basic query via URL
    const data1 = await erddapServer.queryURL(
      "/tabledap/erdCinpKfmSFNH.json?id,size&time>=2007-06-24T00:00:00Z"
    );

    // another way to write the same query (https://github.com/ioos/erddapy)[erdappy] style
    const data2 = await erddapServer.queryDataset({
      datasetID: "erdCinpKfmSFNH",
      variables: ["id", "size"],
      constraints: ["time>=2007-06-24T00:00:00Z"]
    });

    const metadata = await getMetadataByDatasetID("erdCinpKfmSFNH");

    console.log(datasets);
}
```

### NODE Example

See a demo in demo/node/runQuery.js

```js
const ERDDAP = require("dist/node/ERDDAP").default;
```

The rest is the same as the browser example

## Methods

- `ERDDAP()`
- `listDatasets()`
- `getMetadataByDatasetID()`
- `queryURL()`
- `queryDataset()`

## CORS

Lots of ERDDAP servers won't support CORS, so you may run into this issue while trying to use ERDDAP in your browser. If your website that queries ERDDAP isn't on the same web server as ERDDAP then you wil need to [enable CORS](https://enable-cors.org/server.html) on your server.

## Development

To build the package for node and the browser, run

`npm run build`

## Tests & Coverage

- `npm test` to run tests
- `npm run coverage` - to build a folder 'coverage' to see coverage reports in your browser
