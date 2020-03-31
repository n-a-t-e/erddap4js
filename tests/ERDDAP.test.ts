import { expect } from "chai";
import "mocha";

import ERDDAP from "../src/ERDDAP";

describe("reshapeJSON", function () {
  it("reshapes ERDDAP's json response to an array of objects", function () {
    const input = {
      table: {
        columnNames: ["a", "b", "c"],
        rows: [
          ["val1", "val2", "val3"],
          ["val4", "val5", "val6"]
        ]
      }
    };

    const expected = [
      {
        a: "val1",
        b: "val2",
        c: "val3"
      },
      {
        a: "val4",
        b: "val5",
        c: "val6"
      }
    ];
    const output = ERDDAP.reshapeJSON(input);
    expect(output).deep.equal(expected);
  });
});

describe("sanitizeERDDAPURL", function () {
  it("validates and sanitizes ERDDAP server URL", function () {
    expect(ERDDAP.sanitizeERDDAPURL("http://example.com/erddap/")).to.equal(
      "http://example.com/erddap"
    );
    expect(() => ERDDAP.sanitizeERDDAPURL("example.com/erddap/")).to.throw();
  });
});


/*
Error {
  code=400;
  message="Bad Request: Query error: Unrecognized constraint variable="a".";
}
*/


describe("ERDDAP.errorParser", function () {
  it("returns error message", function () {
    expect(ERDDAP.errorParser(
      `Error {
          code=400;
          message="Bad Request: Query error: Unrecognized constraint variable="a".";
      }`
    )).to.equal(
      'Bad Request: Query error: Unrecognized constraint variable="a".'
    );

  });
});
