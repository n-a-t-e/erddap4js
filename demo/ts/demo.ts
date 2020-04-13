import ERDDAP from "../../src/ERDDAP"

(async () => {
    const erddapServer = new ERDDAP("https://coastwatch.pfeg.noaa.gov/erddap");

    // list all available datasets
    const datasets = await erddapServer.allDatasets();

    // tabledap query
    const tableData = await erddapServer.tabledap({
        dataset: "erdCinpKfmSFNH",
        variables: ["id", "size"],
        constraints: [["time", ">=", "2007-06-24T00:00:00Z"]],
    });

    // griddap query
    const gridData = await erddapServer.griddap({
        dataset: "jplAmsreSstMon_LonPM180",
        time: ["2003-11-16T12:00:00Z", "2005-12-16T12:00:00Z"],
        lat: [50, 50],
        long: [-150, -120],
        variables: ["tos", "tosNobs", "tosStderr"],
    });

    // get attribute and variable information for a dataset
    const metadata = await erddapServer.info(
        "erdCinpKfmSFNH"
    );

    // query via URL
    const data = await erddapServer.queryURL(
        "/tabledap/erdCinpKfmSFNH.json?id,size&time>=2007-06-24T00:00:00Z"
    );

})();
