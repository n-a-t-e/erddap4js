/*

Griddap query builder

*/

export interface griddap {
  datasetID: string;
  vars: string[];
  startStrideStop: any[][];
}

export function griddap(options: griddap): string {
  const { datasetID, vars = [], startStrideStop = [] } = options;

  if (!datasetID) throw new Error("Missing datasetID");
  if (!startStrideStop.length) throw new Error("Missing startStrideStop");

  startStrideStop.forEach((ele: string[]) => {
    if (ele.length !== 3)
      throw new Error("Griddap must have 3 values - start,stride,stop");
  });
  // TODO check stride must be an integer? (could be a big integer)
  const triplets = startStrideStop
    .map(([start, stride, stop]) => `[(${start}):${stride}:(${stop})]`)
    .join("");

  const joined = vars.map(var1 => var1 + "" + triplets).join();

  // make sure each element of startStrideStop is a triplet (1,2,3)
  const query = `/griddap/${datasetID}.json?${joined}`;
  return query;
}
