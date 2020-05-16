const ERDDAP = require("erddap4js").default;
const server = "http://localhost:8082/erddap";
/*
 List record counts for each ERDDAP tabledap dataset
 */
(async function () {
  const erddap = new ERDDAP(server);
  const allDatasets = await erddap.allDatasets();

  const tabledapDatasets = allDatasets
    .filter((e) => e.dataStructure == "table")
    .map((e) => e.datasetID);

  for (const dataset of tabledapDatasets) {
    const record = await erddap.tabledap({
      dataset,
      variables: ["time"],
      orderType: "orderByCount",
    });

    // if there are 0 records it will return []
    const rowCount = record[0] ? record[0].time : 0;

    console.log(dataset, rowCount);
  }
})();
