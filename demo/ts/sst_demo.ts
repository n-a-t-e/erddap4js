import ERDDAP from "../../src/ERDDAP"

(async () => {
    const erddapServer = new ERDDAP("https://coastwatch.pfeg.noaa.gov/erddap");


    // griddap query
    const gridData = await erddapServer.griddap({
        dataset: "NOAA_DHW_monthly",
        time: ["2020-02-16T00:00:00Z", "2020-02-16T00:00:00Z"],
        lat: [57.12501, 41.575],
        long: [-128.425, -112.875],
        variables: ["sea_surface_temperature"],
    });
    console.log(JSON.stringify(gridData));


})();
