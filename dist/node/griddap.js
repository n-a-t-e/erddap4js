"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ERDDAP_1 = __importDefault(require("./ERDDAP"));
function griddapURLBuilder(options) {
    if (!options)
        throw new Error("Must supply options object");
    const { dataset, variables } = options;
    if (!dataset)
        throw new Error("Missing dataset");
    const dimensions = ['time', 'altitude', 'depth', 'lat', 'long'];
    const triplets = dimensions.map((dimension) => {
        const value = options[dimension];
        const dimensionArr = value || [];
        if (dimensionArr.length && dimensionArr.length < 2)
            throw new Error(`Must supply Start and Stop for dimension "${dimension}". eg "depth: [1,2]"`);
        const [start, stop, stride] = dimensionArr;
        if (start != null && stop != null) {
            if (dimension == 'time' && !(ERDDAP_1.default.validate8601time(start) && ERDDAP_1.default.validate8601time(stop)))
                throw new Error(`Invalid time: ${value}. Must be in format yyyy-MM-ddTHH:mm:ssZ`);
            return `[(${start}):${stride || 1}:(${stop})]`;
        }
    }).filter(e => e);
    if (!triplets.length)
        throw new Error("Must filter on at least one dimension.");
    const joined = variables.map(var1 => var1 + "" + triplets.join("")).join();
    const query = `/griddap/${dataset}.json?${joined}`;
    return query;
}
exports.griddapURLBuilder = griddapURLBuilder;
