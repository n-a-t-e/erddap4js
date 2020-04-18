import fetch from "node-fetch";
import { griddapURLBuilder, griddapOptions } from "./griddap";
import { tabledapURLBuilder, tabledapOptions } from "./tabledap";

export default class ERDDAP {
  // url of server, eg, https://example.com/erddap/
  serverURL: string;
  // clean up url
  constructor(url: string, private debug: boolean = false) {
    this.serverURL = ERDDAP.sanitizeERDDAPURL(url);
  }
  static validate8601time(str: string): Boolean {
    if (typeof (str) !== 'string')
      return false
    // must match yyyy-MM-ddTHH:mm:ssZ
    const regex8601 = /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})Z?/;
    return Boolean(str.match(regex8601));
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
    const urlComplete = this.serverURL + urlpath;
    if (this.debug) console.warn(`FETCHING ${urlComplete}\n`)
    return fetch(urlComplete).then(async response => {
      if (!response.ok) {
        const responseText = await response.text();
        if (response.status == 404 && responseText.includes("nRows = 0"))
          return [];

        // if it wasn't "no-data error" then it's a real error
        throw new Error(`HTTP ${response.status} error fetching ${urlComplete}\n${ERDDAP.errorParser(responseText)}\n\n`);
      }
      return response.json().then(ERDDAP.reshapeJSON);
    });
  }

  async tabledap(options: tabledapOptions) {
    return this.queryURL(tabledapURLBuilder(options));
  }

  async griddap(options: griddapOptions) {
    return this.queryURL(griddapURLBuilder(options));
  }

  // parse out the message="" section
  static errorParser(errorMessage: string): string {
    const re = new RegExp(/message=\"(.*)\"/).exec(errorMessage) || [];

    if (re.length > 1)
      return re[1].replace(/\\n/g, "\n").replace(/\\/g, '');

    return errorMessage;
  }
  // return type
  async info(datasetID: string): Promise<object[]> {
    if (!datasetID) throw new Error('Missing dataset ID');

    return this.queryURL(`/info/${datasetID}/index.json`);
  }

  // get array of dataset info
  async allDatasets(): Promise<string[]> {
    // this gets griddap datasets too
    const res = await this.queryURL("/tabledap/allDatasets.json");

    return res
      .filter((e: any) => e.datasetID !== "allDatasets");
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
