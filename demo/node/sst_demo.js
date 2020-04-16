const ERDDAP = require("../../dist/node/ERDDAP").default;
/*

Download satellite SST data for a list of points. Downloads in series to not overwhelm server. Change the time

*/

(async () => {
  const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const stations = [
    ["C46036", 48.3, 226.14],
    ["C46205", 54.3, 226.6],
    ["C46206", 48.83, 234.0],
  ];

  const erddapServer = new ERDDAP("https://www.ncei.noaa.gov/erddap", true);

  const results = [];

  for (const station of stations) {
    const [name, lat, long] = station;
    const stationData = await erddapServer
      .griddap({
        dataset: "ncdc_oisst_v2_avhrr_by_time_zlev_lat_lon",
        time: ["2020-03-31T12:00:00Z", "2020-03-31T12:00:00Z"],
        depth: [0, 0],
        lat: [lat, lat],
        long: [long, long],
        variables: ["sst", "anom", "err"],
      })
      .then((res) => res.map((ele) => ({ station: name, ...ele })));

    results.push(...stationData);

    await sleep(2000);
  }
  console.log(JSON.stringify(results, null, 2));
})();
