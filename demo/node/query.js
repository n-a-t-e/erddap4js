const ERDDAP = require("../../dist/node/ERDDAP").default;

(async () => {
  const erddapServer = new ERDDAP("https://coastwatch.pfeg.noaa.gov/erddap");

  const datasets = await erddapServer.listDatasets();
  console.log(datasets);

  const data = await erddapServer.queryDataset({
    datasetID: "erdCinpKfmSFNH",
    variables: ["id", "size"],
    constraints: ["time>=2007-06-24T00:00:00Z"]
  });

  console.log(data);
})();
