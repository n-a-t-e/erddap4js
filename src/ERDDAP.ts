import fetch from "node-fetch";
import { griddap } from "./griddap";
import { tabledap } from "./tabledap";

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

  // reshapes ERDDAP's json response so it's easier for web apps to consume
  // see tests/ERDDAP.test.ts for an example of the translation
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
    const urlComplete = this.serverURL + urlpath
    return fetch(urlComplete).then(async response => {
      if (!response.ok) {
        const responseText = await response.text();
        if (response.status == 404 && responseText.includes("nRows = 0"))
          return [];

        // if it wasn't "no-data error" then it's a real error
        throw new Error(`HTTP ${response.status} error fetching ${urlComplete}\n${ERDDAP.errorParser(responseText)}\n`);
      }
      return response.json().then(ERDDAP.reshapeJSON);
    });
  }

  async tabledap(options: tabledap) {
    return this.queryURL(tabledap(options));
  }

  async griddap(options: griddap) {
    return this.queryURL(griddap(options));
  }

  // parse out the message="" section
  static errorParser(errorMessage: string): string {
    const re = new RegExp(/message=\"(.*)\"/).exec(errorMessage) || [];
    return re[1] || errorMessage;
  }

  // get array of dataset IDs
  // TODO does this check griddap datasets too?
  async listDatasets(): Promise<any> {
    const res = await this.queryURL("/tabledap/allDatasets.json?datasetID");

    return res
      .map((row: any) => row.datasetID)
      .filter((e: string) => e !== "allDatasets");
  }
}

namespace ERDDAP {
  // used in parsing ERDDAP's json response
  export interface JSONResponse {
    table: {
      columnNames: string[];
      rows: Array<any>;
    };
  }
}
