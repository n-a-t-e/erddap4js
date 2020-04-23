import ERDDAP from "../../src/ERDDAP"

(async () => {

    const erddapServer = new ERDDAP("https://coastwatch.pfeg.noaa.gov/erddap", true);

    const tableData = await erddapServer.tabledap({
        dataset: "erdCinpKfmSFNH",
        variables: ["id", "common_name", "size", "time"],
        constraints: [
            ["time", ">", "2006-04-23T15:20:36+00:00"],
        ],

    })

    const gridData = await erddapServer.griddap({
        dataset: "jplAmsreSstMon_LonPM180",
        time: ["2010-12-16T12:00:00Z", "2010-12-16T12:00:00Z"],
        lat: [50, 50],
        long: [-150, -120],
        variables: ["tos", "tosNobs", "tosStderr"],
    });

    // get variable and global attribute information for this dataset
    const metadata = await erddapServer.info("erdCinpKfmSFNH");

    // get metadata for all datasets
    const datasets = await erddapServer.allDatasets();

    console.log(tableData);
})();
