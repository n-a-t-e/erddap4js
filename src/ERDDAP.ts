import fetch from "node-fetch";

export default class ERDDAP {
  // url of server, eg, https://example.com/erddap/
  serverURL: string;
  // clean up url
  constructor(url: string) {
    this.serverURL = ERDDAP.sanitizeERDDAPURL(url);
  }

  static sanitizeERDDAPURL(url: string): string {
    // remove trailing "/"
    url = url.replace(/\/$/, "");

    if (!url.match(/https?:\/\//)?.length) {
      throw new Error("URL Must start wih http or https");
    }
    if (!url.endsWith("/erddap"))
      console.warn(`URL doesn't end in /erddap, trying anyway: ${url}`);
    return url;
  }

  // reshapes ERDDAP response so it's easier for web apps to consume
  // see ERDDAP.test.ts for an example of the translation
  static reshapeJSON(erddapJSON: ERDDAP.JSONResponse): object[] {
    const { columnNames, rows } = erddapJSON.table;

    return rows.map((rowArray: any[]) =>
      rowArray.reduce((rowObject: any, value: any[], i) => {
        rowObject[columnNames[i]] = value;
        return rowObject;
      }, {})
    );
  }

  // Query a url path such as "/tabledap/erdCinpKfmSFNH.json?id,size"
  // ERDDAP throws a 404 error when there is no data found, this returns an empty array instead
  async queryURL(urlpath: string): Promise<any> {
    return fetch(this.serverURL + urlpath).then(async response => {
      if (!response.ok) {
        if (response.status == 404) {
          const text = await response.text();
          if (text.includes("nRows = 0")) return [];
        }
        throw Error(response.statusText);
      }
      return response.json().then(ERDDAP.reshapeJSON);
    });
  }
  // querying datasets erddapy style
  queryDataset(config: ERDDAP.Query): Promise<any> {
    const { datasetID, variables, constraints } = config;
    let query = `/tabledap/${datasetID}.json?${variables.join(",")}`;
    if (constraints) query += "&" + constraints.join("&");
    return this.queryURL(query);
  }

  // list metadata including variables
  getMetadataByDatasetID(datasetID: string): Object {
    return this.queryURL(`/info/${datasetID}/index.json`);
  }

  // get array of dataset IDs
  async listDatasets(): Promise<any> {
    const res = await this.queryURL("/tabledap/allDatasets.json?datasetID");

    return res
      .map((row: any) => row.datasetID)
      .filter((e: string) => e !== "allDatasets");
  }
}

// typescript interfaces
namespace ERDDAP {
  // used in queryDataset()
  export interface Query {
    datasetID: string;
    variables: string[];
    constraints: string[];
  }

  // used in parsing ERDDAP's json response
  export interface JSONResponse {
    table: {
      columnNames: string[];
      rows: Array<any>;
    };
  }
}
