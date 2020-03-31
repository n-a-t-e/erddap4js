"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function griddap(options) {
    const { datasetID, vars = [], startStrideStop = [] } = options;
    if (!datasetID)
        throw new Error("Missing datasetID");
    if (!startStrideStop.length)
        throw new Error("Missing startStrideStop");
    startStrideStop.forEach((ele) => {
        if (ele.length !== 3)
            throw new Error("Griddap must have 3 values - start,stride,stop");
    });
    const triplets = startStrideStop
        .map(([start, stride, stop]) => `[(${start}):${stride}:(${stop})]`)
        .join("");
    const joined = vars.map(var1 => var1 + "" + triplets).join();
    const query = `/griddap/${datasetID}.json?${joined}`;
    return query;
}
exports.griddap = griddap;
