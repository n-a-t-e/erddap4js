const ERDDAP = require("../../dist/node/ERDDAP").default;

(async () => {
  const erddapServer = new ERDDAP("https://coastwatch.pfeg.noaa.gov/erddap");

  const datasets = await erddapServer.allDatasets();
  console.log(datasets.length);

  const data = await erddapServer.tabledap({
    dataset: "erdCinpKfmSFNH",
    variables: ["id", "size"],
    constraints: [["time", ">=", "2007-06-24T00:00:00Z"]],
  });

  console.log(data);
})();
