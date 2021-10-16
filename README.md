# Rate connectors

Exchange rate connectors for DEX plateforms

### Prerequisites

To be able to connect to Kyber and interfacing with its token swap smart contract, we need to install

```
nodejs
node package manager npm
web3
```

### Installing
On ubuntu execute those commands:

```
sudo apt install nodejs
sudo apt install npm
```
After initiate a node project and install web3. It will create node_modules folder and package.json file.

```
npm init -y
sudo npm install dotenv
sudo npm install web3
sudo npm instamm@uniswap/sdk@3.0.2 
```

## Running the tests
For all Kyber ERC-20 tokens (other DEX is to come),inside rate-conectors folder, run:

```
node kyber-rates.js
``` 
It will connect to a node through infura and on every new block comming, it will compute and console log the exchange rate, for ex:
{
    blockNum: 12401528,
    pair: 'ETH/DAI',
    buy: 3909.7385544545573,
    buy_with_slippage: 3792.4463978209205,
    sell: 3931.1899822243427,
    sell_with_slippage: 4052.7731775508782
} 

The computation is done on a subscribtion mode with a callback so to stop the log, just kill the process.


## Future work

Connect to other DEX.


