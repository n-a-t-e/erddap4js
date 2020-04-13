"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function griddapURLBuilder(options) {
    if (!options)
        throw new Error("Must supply options object");
    const { dataset, variables } = options;
    if (!dataset)
        throw new Error("Missing dataset");
    const dimensions = ['time', 'altitude', 'depth', 'lat', 'long'];
    const triplets = dimensions.map((dimension) => {
        const dimensionArr = options[dimension] || [];
        if (dimensionArr.length && dimensionArr.length < 2)
            throw new Error(`Must supply Start and Stop for dimension "${dimension}". eg "depth: [1,2]"`);
        const [start, stop, stride] = dimensionArr;
        if (start && stop)
            return `[(${start}):${stride || 1}:(${stop})]`;
    }).filter(e => e);
    if (!triplets.length)
        throw new Error("Must filter on at least one dimension.");
    const joined = variables.map(var1 => var1 + "" + triplets.join("")).join();
    const query = `/griddap/${dataset}.json?${joined}`;
    return query;
}
exports.griddapURLBuilder = griddapURLBuilder;
