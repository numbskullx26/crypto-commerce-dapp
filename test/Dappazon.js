const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

//Global Constants for listing an item...

const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE =
  "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

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

  describe("Deployment", async () => {
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

  describe("Listing", async () => {
    let transaction;

    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);

      await transaction.wait();
    });

    it("Returns item attributes", async () => {
      const item = await dappazon.items(ID);

      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);

      it("Emits List Event", async () => {
        expect(transaction).to.emit(dappazon, "List");
      });
    });
  });

  describe("Buying", async () => {
    let transaction;

    beforeEach(async () => {
      //list an ite
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      //buy an item by sending ether from the buyer to the Contract
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST });
    });

    //checking if the contract has received the sent Ether(COST)
    it("Updates Contract Balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.equal(COST);
      console.log(result);
    });
  });
});
