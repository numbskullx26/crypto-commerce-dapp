const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Dappazon", () => {
  let dappazon;
  let deployer, buyer;

  beforeEach(async () => {
    //setup accounts
    [deployer, buyer] = await ethers.getSigners();

    //deploying the contract
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
  });

  describe("Deployemnt", async () => {
    it("Sets the Owner", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address);
    });
    //
    //Initial Testing
    // it("has a name", async () => {
    //   const name = await dappazon.name();
    //   expect(name).to.equal("Dappazon");
    // });
  });
});
