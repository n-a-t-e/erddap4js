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
        const optionFieldNames = ['dataset', 'variables', 'constraints', 'distinct', 'orderType', 'orderVariables'];
        Object.keys(options).forEach(k => {
            if (!optionFieldNames.includes(k)) {
                throw new Error(`Option '${k}' is not supported. The options are: ${optionFieldNames}`);
            }
        });
        if (!dataset)
            throw new Error("Missing 'dataset' option");
        if (orderType) {
            if (!orderByOptions.includes(orderType)) {
                throw new Error(`Order type given was '${orderType}'. It must be one of: ${orderByOptions}`);
            }
            if (!orderVariables.length) {
                throw new Error("At least one variable must be given to order by. eg {..., orderVariables: ['time']}");
            }
        }
        constraints.forEach(([variable, operator, value]) => {
            if (!operators.includes(operator))
                throw new Error(`Invalid operator: '${operator}'. Must be one of: '${operators}'`);
            switch (variable) {
                case "time":
                    break;
                case "latitude":
                    if (Math.abs(value) > 90)
                        throw new Error("Invalid lat: " + value);
                    break;
                case "longitude":
                    if (Math.abs(value) > 180)
                        throw new Error("Invalid long: " + value);
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
        else
            console.warn("No 'variables' field given, retrieving all variables");
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
