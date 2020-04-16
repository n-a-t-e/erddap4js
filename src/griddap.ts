/*

Griddap query builder

example options:
{
  dataset: "jplAmsreSstMon_LonPM180",
  time: ["2010-12-16T12:00:00Z", "2010-12-16T12:00:00Z"],
  lat: [50, 50],
  long: [-150, -120],
  variables: ['tos', 'tosNobs', 'tosStderr']
}

*/

import ERDDAP from "./ERDDAP";

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
    const value = options[dimension];
    const dimensionArr = value || []
    if (dimensionArr.length && dimensionArr.length < 2)
      throw new Error(`Must supply Start and Stop for dimension "${dimension}". eg "depth: [1,2]"`);

    const [start, stop, stride] = dimensionArr;
    if (start != null && stop != null) {
      if (dimension == 'time' && !(ERDDAP.validate8601time(start) && ERDDAP.validate8601time(stop)))
        throw new Error(`Invalid time: ${value}. Must be in format yyyy-MM-ddTHH:mm:ssZ`);
      return `[(${start}):${stride || 1}:(${stop})]`;
    }
  }).filter(e => e);
  if (!triplets.length) throw new Error("Must filter on at least one dimension.")
  const joined = variables.map(var1 => var1 + "" + triplets.join("")).join();

  const query = `/griddap/${dataset}.json?${joined}`;

  return query;
}
