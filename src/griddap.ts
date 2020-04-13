/*

Griddap query builder

example options:
{
  time: ["2008-12-15T00:00:00Z", "2009-12-15T00:00:00Z"],
  altitude (or depth): [1, 10],
  lat: [-75.25, 89.25],
  long: [0.25, 359.75, 1], // <-- stride explicitly 1
  variables: ['sstp']
}

*/

export interface griddapOptions {
  dataset: string;
  time: any[],
  altitude?: number[]
  depth?: number[]
  lat?: number[],
  long?: number[],
  variables: string[]
}

export function griddapURLBuilder(options: griddapOptions): string {
  if (!options) throw new Error("Must supply options object")
  const { dataset, variables } = options;
  if (!dataset) throw new Error("Missing dataset");
  const dimensions = ['time', 'altitude', 'depth', 'lat', 'long'];

  // TODO could do validation on these fields
  const triplets = dimensions.map((dimension: string) => {
    // @ts-ignore - TODO
    const dimensionArr = options[dimension] || []
    if (dimensionArr.length && dimensionArr.length < 2)
      throw new Error(`Must supply Start and Stop for dimension "${dimension}". eg "depth: [1,2]"`);

    const [start, stop, stride] = dimensionArr;
    if (start && stop)
      return `[(${start}):${stride || 1}:(${stop})]`;
  }).filter(e => e);
  if (!triplets.length) throw new Error("Must filter on at least one dimension.")
  const joined = variables.map(var1 => var1 + "" + triplets.join("")).join();

  const query = `/griddap/${dataset}.json?${joined}`;

  return query;
}
