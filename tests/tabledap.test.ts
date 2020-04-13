import { expect } from "chai";
import "mocha";

import { tabledapURLBuilder } from "../src/tabledap";

describe("tabledap", function () {
  it("should generate a tabledap URL", function () {
    expect(
      tabledapURLBuilder({
        dataset: "23",
        variables: ["time"],
        constraints: [["time", ">", "2005"]]
      })
    ).to.equal("/tabledap/23.json?time&time>2005");
  });

  it("should work without return variables", function () {
    expect(
      tabledapURLBuilder({
        dataset: "23",
        constraints: [["time", ">", "2005"]]
      })
    ).to.equal("/tabledap/23.json?&time>2005");
  });
  it("should work without constrains or variables", function () {
    expect(
      tabledapURLBuilder({
        dataset: "23",
      })
    ).to.equal("/tabledap/23.json");
  });
});
