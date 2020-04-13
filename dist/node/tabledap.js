"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators = ["!=", "=~", "<=", ">=", "=", "<", ">"];
function tabledapURLBuilder(options) {
    {
        const { dataset, variables = [], constraints = [], distinct, orderType, orderVariables = [] } = options;
        const orderByOptions = [
            "orderBy",
            "orderByClosest",
            "orderByCount",
            "orderByLimit",
            "orderByMax",
            "orderByMin",
            "orderByMinMax",
            "orderByMean"
        ];
        if (!dataset)
            throw new Error("Missing dataset");
        if (orderType) {
            if (!orderByOptions.includes(orderType)) {
                throw new Error(`Order type given was '${orderType}'. It must be one of: ${orderByOptions}`);
            }
            if (!orderVariables.length) {
                throw new Error("At least one variable must be given to order by");
            }
        }
        constraints.forEach(([variable, operator, value]) => {
            if (!operators.includes(operator))
                throw new Error(`Invalid operator: '${operator}'. Must be one of: '${operators}'`);
            switch (variable) {
                case "time":
                    break;
                case "latitude":
                case "longitude":
                    if (Math.abs(value) > 180)
                        throw new Error("Invalid lat/long: " + value);
                    break;
                case "depth":
                case "altitude":
                    if (parseFloat(value) == NaN)
                        throw new Error("Invalid depth/altitude: " + value);
                    break;
                default:
                    break;
            }
        });
        let query = `/tabledap/${dataset}.json`;
        const expressions = [];
        if (variables.length)
            expressions.push(variables.join());
        if (constraints.length)
            expressions.push(constraints.map(e => e.join("")).join("&"));
        if (distinct)
            expressions.push("distinct()");
        if (orderType && orderVariables)
            expressions.push(`${orderType}(${orderVariables.join()})`);
        if (expressions.length)
            query += '?' + (variables.length ? '' : '&') + expressions.join("&");
        return query;
    }
}
exports.tabledapURLBuilder = tabledapURLBuilder;
