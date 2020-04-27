import { expect } from "chai";
import "mocha";

import { griddapURLBuilder } from "../src/griddap";

describe("griddap", function () {
  it("should generate a griddap URL", function () {
    expect(
      griddapURLBuilder({
        dataset: "jplAmsreSstMon_LonPM180",
        time: ["2010-12-16T12:00:00Z", "2010-12-16T12:00:00Z"],
        latitude: [50, 50],
        longitude: [-150, -120],
        variables: ['tos', 'tosNobs', 'tosStderr']
      })
    ).to.equal(
      "/griddap/jplAmsreSstMon_LonPM180.json?tos[(2010-12-16T12:00:00Z):1:(2010-12-16T12:00:00Z)][(50):1:(50)][(-150):1:(-120)],tosNobs[(2010-12-16T12:00:00Z):1:(2010-12-16T12:00:00Z)][(50):1:(50)][(-150):1:(-120)],tosStderr[(2010-12-16T12:00:00Z):1:(2010-12-16T12:00:00Z)][(50):1:(50)][(-150):1:(-120)]"
    );
  });
  it("should allow 'last' keyword everywhere ", function () {
    expect(
      griddapURLBuilder({
        dataset: "jplAmsreSstMon_LonPM180",
        time: ["last", "last"],
        altitude: ["last", "last"],
        lat: ['last', 'last'],
        lon: ['last', 'last'],
        variables: ['tos', 'tosNobs', 'tosStderr']
      })
    ).to.equal(
      "/griddap/jplAmsreSstMon_LonPM180.json?tos[(last):1:(last)][(last):1:(last)][(last):1:(last)][(last):1:(last)],tosNobs[(last):1:(last)][(last):1:(last)][(last):1:(last)][(last):1:(last)],tosStderr[(last):1:(last)][(last):1:(last)][(last):1:(last)][(last):1:(last)]"
    );
  });
  it("should validate times correctly", function () {
    expect(() =>
      griddapURLBuilder({
        dataset: "jplAmsreSstMon_LonPM180",
        time: ["2010-12-16T12:00:00Z", "last-100"],
        variables: ['tos']
      }), "1"
    ).to.not.throw();
    expect(() =>
      griddapURLBuilder({
        dataset: "jplAmsreSstMon_LonPM180",
        time: ["2010-12-16T12:00:00Z", "now"],
        variables: ['tos']
      }), "2"
    ).to.throw();
  });
  it("should fail if dataset ID not given", function () {
    expect(
      griddapURLBuilder
    ).to.throw;
  });
});