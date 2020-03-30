"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function griddap(options) {
    const { datasetID, vars, startStrideStop } = options;
    startStrideStop.forEach((ele) => {
        if (ele.length !== 3)
            throw new Error("Griddap must have 3 values - start,stride,stop");
    });
    const triplets = startStrideStop
        .map(([start, stride, stop]) => `[(${start}): ${stride}: (${stop})]`)
        .join();
    const query = `/griddap/${datasetID}.json?${vars}${triplets}`;
    return query;
}
exports.griddap = griddap;
