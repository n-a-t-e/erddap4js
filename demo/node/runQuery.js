const ERDDAP = require("../../dist/node/ERDDAP").default;

(async () => {
  const erddapServer = new ERDDAP("https://catalogue.hakai.org/erddap");

  const datasets = await erddapServer.listDatasets();

  // const metadata = await erddapServer.getMetadataByDatasetID(datasets[0]);

  // const someData = await erddapServer.query(
  //   "/tabledap/HakaiBaynesSoundBoL5min.json?time,latitude,longitude"
  // );
  const a = await erddapServer.queryDataset({
    datasetID: "HakaiBaynesSoundBoL5min",
    variables: ["time", "latitude", "longitudes"],
    constraints: ["time>=2020-03-28T00:00:00Z"]
  });

  console.log(a);
})();
