import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

// ABIs
import Dappazon from "./abis/Dappazon.json";

// Config
import config from "./config.json";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [dappazon, setDappazon] = useState(null);
  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);
  const [item, setItem] = useState(null);
  const [toggle, setToggle] = useState(false);

  const togglePop = (item) => {
    setItem(item);

    toggle ? setToggle(false) : setToggle(true);
  };

  const loadBlockChainData = async () => {
    //Connect to the Blockchain

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    console.log(network);

    ////Connect to the Smart Contracts(create JS instances)
    const dappazon = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      Dappazon,
      provider
    );

    setDappazon(dappazon);

    //Load Products

    const items = [];
    for (var i = 0; i < 9; i++) {
      const item = await dappazon.items(i + 1);
      items.push(item);
    }

    const electronics = await items.filter(
      (item) => item.category === "electronics"
    );
    setElectronics(electronics);
    const clothing = await items.filter((item) => item.category === "clothing");
    setClothing(clothing);
    const toys = await items.filter((item) => item.category === "toys");
    setToys(toys);

    console.log(items);
  };

  useEffect(() => {
    loadBlockChainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Welcome to Dappazon</h2>

      {electronics && clothing && toys && (
        <>
          <Section
            title={"Clothing & Jewelry"}
            items={clothing}
            togglePop={togglePop}
          />
          <Section
            title={"Electronics & Gadgets"}
            items={electronics}
            togglePop={togglePop}
          />
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )}

      {toggle && (
        <Product
          item={item}
          togglePop={toggle}
          provider={provider}
          dappazon={dappazon}
          account={account}
        />
      )}
    </div>
  );
}

export default App;
