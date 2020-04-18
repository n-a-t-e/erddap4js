/*

tabledap query builder


*/

const operators = ["!=", "=~", "<=", ">=", "=", "<", ">"];

export interface tabledapOptions {
  dataset: string;
  variables?: string[];
  constraints?: any[][];
  distinct?: boolean;
  orderType?: string;
  orderVariables?: string[];
}

export function tabledapURLBuilder(options: tabledapOptions): string {
  {
    const {
      dataset,
      variables = [],
      constraints = [],
      distinct,
      orderType,
      orderVariables = []
    } = options;

    // validate constraints
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

    if (!dataset) throw new Error("Missing dataset");

    if (orderType) {
      if (!orderByOptions.includes(orderType)) {
        throw new Error(
          `Order type given was '${orderType}'. It must be one of: ${orderByOptions}`
        );
      }

      if (!orderVariables.length) {
        throw new Error("At least one variable must be given to order by. eg {..., orderVariables: ['time']}");
      }
    }
    constraints.forEach(([variable, operator, value]) => {
      if (!operators.includes(operator))
        throw new Error(
          `Invalid operator: '${operator}'. Must be one of: '${operators}'`
        );

      // some basic type checking of special case variables (LLAT variables)
      switch (variable) {
        case "time":
          // TODO check time somehow. It can take things like "2005"
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
    if (variables.length) expressions.push(variables.join());
    if (constraints.length)
      expressions.push(constraints.map(e => e.join("")).join("&"));
    if (distinct) expressions.push("distinct()");
    if (orderType && orderVariables)
      expressions.push(`${orderType}(${orderVariables.join()})`);

    // erddap requires the '?&' if there are no return variables
    if (expressions.length) query += '?' + (variables.length ? '' : '&') + expressions.join("&");

    return query;
  }
}
