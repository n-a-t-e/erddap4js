import { expect } from "chai";
import "mocha";

import { griddapURLBuilder } from "../src/griddap";

describe("griddap", function () {
  it("should generate a griddap URL", function () {
    expect(
      griddapURLBuilder({
        dataset: "jplAmsreSstMon_LonPM180",
        time: ["2010-12-16T12:00:00Z", "2010-12-16T12:00:00Z"],
        lat: [50, 50],
        long: [-150, -120],
        variables: ['tos', 'tosNobs', 'tosStderr']
      })
    ).to.equal(
      "/griddap/jplAmsreSstMon_LonPM180.json?tos[(2010-12-16T12:00:00Z):1:(2010-12-16T12:00:00Z)][(50):1:(50)][(-150):1:(-120)],tosNobs[(2010-12-16T12:00:00Z):1:(2010-12-16T12:00:00Z)][(50):1:(50)][(-150):1:(-120)],tosStderr[(2010-12-16T12:00:00Z):1:(2010-12-16T12:00:00Z)][(50):1:(50)][(-150):1:(-120)]"
    );
  });
  it("should fail if dataset ID not given", function () {
    expect(
      griddapURLBuilder
    ).to.throw;
  });
});