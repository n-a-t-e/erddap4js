[![Node.js CI](https://github.com/n-a-t-e/erddap4js/workflows/Node.js%20CI/badge.svg)](https://github.com/n-a-t-e/erddap4js/actions)

# erddap4js - ERDDAP JavaScript interface for the browser & Node

Simple [ERDDAP](https://coastwatch.pfeg.noaa.gov/erddap/index.html) library for JS, written in TypeScript. Works in Node or the browser. Supports tabledap and griddap queries. Browser version is dependency free.

## Quickstart

### Browser example

See a demo in demo/browser/index.html

Put the dist/browser/ERDDAP.js in the same folder with your HTML file.

```html
<script src="ERDDAP.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", async function () {
    const erddapServer = new ERDDAP("https://coastwatch.pfeg.noaa.gov/erddap");

    const tableData = await erddapServer.tabledap({
      dataset: "erdCinpKfmSFNH",
      variables: ["id", "common_name"],
      constraints: [
        ["time", ">=", "2007-06-24T00:00:00Z"],
        ["size", ">=", 140],
        ["common_name", "=~", ".*urchin.*"],
      ],
      distinct: true,
    });

    /* Result:
       [ { id: 'Anacapa (Landing Cove)', common_name: 'Red sea urchin' } ]
    */

    const gridData = await erddapServer.griddap({
      dataset: "jplAmsreSstMon_LonPM180",
      time: ["2010-12-16T12:00:00Z", "2010-12-16T12:00:00Z"],
      lat: [50, 50],
      long: [-150, -120],
      variables: ["tos", "tosNobs", "tosStderr"],
    });

    /* Result:
      [ { time: '2010-12-16T12:00:00Z',
          latitude: 50.5,
          longitude: -150,
          tos: 6.109735,
          tosNobs: 3175,
          tosStderr: 0.6101171 }, ... ]
    */

    // get variable and global attribute information for this dataset
    const metadata = await erddapServer.info("erdCinpKfmSFNH");

    /* Result:
      [ { 'Row Type': 'attribute',
          'Variable Name': 'NC_GLOBAL',
          'Attribute Name': 'acknowledgement',
          'Data Type': 'String',
          Value: 'NOAA NESDIS COASTWATCH, NOAA SWFSC ERD, Channel Islands National Park, National Park Service'
          },
          ...
        { 'Row Type': 'variable',
          'Variable Name': 'longitude',
          'Attribute Name': '',
          'Data Type': 'double',
          Value: ''
        }, ...]
    */

    // get metadata for all datasets
    const datasets = await erddapServer.allDatasets();
  });
</script>
```

### Node example

The import is different, the rest is the same as the browser example above.

```bash
npm install git+https://github.com/n-a-t-e/erddap4js.git
```

```js
const ERDDAP = require("erddap4js/dist/node/ERDDAP").default;
```

See a demo in demo/node/runQuery.js

## Methods

- `tabledap()`
- `griddap()`
- `info()`
- `allDatasets()`
- `queryURL()`

## CORS

Lots of ERDDAP servers won't support CORS, so you may run into this issue while trying to use ERDDAP in your browser. If your website that queries ERDDAP isn't on the same web server as ERDDAP then you wil need to [enable CORS](https://enable-cors.org/server.html) on your server.

## Development

To build the package for node and the browser, run

`npm run build`

## Tests & coverage

- `npm test` to run tests
- `npm run coverage` - to build a folder 'coverage' to see coverage reports in your browser
- `act` - test Github Actions with [act](https://github.com/nektos/act)
