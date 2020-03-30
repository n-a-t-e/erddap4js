"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const griddap_1 = require("./griddap");
const tabledap_1 = require("./tabledap");
class ERDDAP {
    constructor(url) {
        this.serverURL = ERDDAP.sanitizeERDDAPURL(url);
    }
    static sanitizeERDDAPURL(url) {
        var _a;
        url = url.replace(/\/$/, "");
        if (!((_a = url.match(/https?:\/\//)) === null || _a === void 0 ? void 0 : _a.length)) {
            throw new Error("URL Must start wih http or https");
        }
        if (!url.endsWith("/erddap"))
            console.warn(`URL doesn't end in /erddap, trying anyway: ${url}`);
        return url;
    }
    static reshapeJSON(erddapJSON) {
        const { columnNames, rows } = erddapJSON.table;
        return rows.map((rowArray) => rowArray.reduce((rowObject, value, i) => {
            rowObject[columnNames[i]] = value;
            return rowObject;
        }, {}));
    }
    queryURL(urlpath) {
        return __awaiter(this, void 0, void 0, function* () {
            return node_fetch_1.default(this.serverURL + urlpath).then((response) => __awaiter(this, void 0, void 0, function* () {
                if (!response.ok) {
                    if (response.status == 404) {
                        const responseText = yield response.text();
                        if (responseText.includes("nRows = 0"))
                            return [];
                    }
                    throw Error(response.statusText);
                }
                return response.json().then(ERDDAP.reshapeJSON);
            }));
        });
    }
    tabledap(options) {
        return this.queryURL(tabledap_1.tabledap(options));
    }
    griddap(options) {
        return this.queryURL(griddap_1.griddap(options));
    }
    listDatasets() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.queryURL("/tabledap/allDatasets.json?datasetID");
            return res
                .map((row) => row.datasetID)
                .filter((e) => e !== "allDatasets");
        });
    }
}
exports.default = ERDDAP;
