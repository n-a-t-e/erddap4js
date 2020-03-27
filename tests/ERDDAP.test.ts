import { expect } from "chai";
import "mocha";

import ERDDAP from "../src/ERDDAP";

describe("reshapeJSON", function() {
  it("reshapes ERDDAP's json response to an array of objects", function() {
    const input = {
      table: {
        columnNames: ["a", "b", "c"],
        columnTypes: ["String", "String", "String"],
        columnUnits: ["d", "e", "f"],
        rows: [["val1", "val2", "val3"]]
      }
    };

    const expected = [
      {
        a: "val1",
        b: "val2",
        c: "val3"
      }
    ];
    const output = ERDDAP.reshapeJSON(input);
    expect(output).deep.equal(expected);
  });
});

describe("sanitizeERDDAPURL", function() {
  it("validates and sanitizes ERDDAP server URL", function() {
    expect(ERDDAP.sanitizeERDDAPURL("http://example.com/erddap/")).to.equal(
      "http://example.com/erddap"
    );
    expect(() => ERDDAP.sanitizeERDDAPURL("example.com/erddap/")).to.throw();
  });
});
