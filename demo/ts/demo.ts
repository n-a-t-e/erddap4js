import ERDDAP from "../../src/ERDDAP"

(async () => {

    const erddapServer = new ERDDAP("https://coastwatch.pfeg.noaa.gov/erddap");

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
        latitude: [50, 50],
        longitude: [-150, -150],
        variables: ["tos", "tosNobs", "tosStderr"],
    });
    console.log(tableData);
})();
