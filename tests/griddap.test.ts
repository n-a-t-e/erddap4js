import { expect } from "chai";
import "mocha";

import { griddap } from "../src/griddap";

describe("griddap", function() {
  it("should generate a griddap URL", function() {
    expect(
      griddap({
        datasetID: "jplAmsreSstMon_LonPM180",
        vars: ["tos", "tosNobs", "tosStderr"],
        startStrideStop: [
          ["2010-12-16T12:00:00Z", 1, "2010-12-16T12:00:00Z"],
          [50, 1, 50],
          [-150, 1, -120]
        ]
      })
    ).to.equal(
      "/griddap/jplAmsreSstMon_LonPM180.json?tos[(2010-12-16T12:00:00Z):1:(2010-12-16T12:00:00Z)][(50):1:(50)][(-150):1:(-120)],tosNobs[(2010-12-16T12:00:00Z):1:(2010-12-16T12:00:00Z)][(50):1:(50)][(-150):1:(-120)],tosStderr[(2010-12-16T12:00:00Z):1:(2010-12-16T12:00:00Z)][(50):1:(50)][(-150):1:(-120)]"
    );
  });
});
