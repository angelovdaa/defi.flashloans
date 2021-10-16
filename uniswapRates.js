//Env constants and params
require('dotenv').config({ path: __dirname + '/.env' });

//Get provider to a chain node with infura
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.INFURA_URL_WSS)
);

//import dex tokens lists
const{tokenLists: dexTokenLists} = require('./dex_tokens');

//import Uniswap SDK
const { ChainId, Token, Pair, Fetcher, Trade, Route, TokenAmount, TradeType } = require('@uniswap/sdk');

// TODO: This must be externaly updated
const DAI_DECIMALS=18;
const AMOUNT_WETH = 1*10**18;

const init = async () => {
  const [dai, weth] = await Promise.all(
    [dexTokenLists.uniswapTokens.dai, dexTokenLists.uniswapTokens.weth].map(tokenAddress => (
      Fetcher.fetchTokenData(
        ChainId.MAINNET,
        tokenAddress,
      )
  )));
  

  /*
  console.log("Fetched tokens");
  console.log(dai);
  console.log(weth);
*/

// WETH/DAI pair
  pair = await Fetcher.fetchPairData(
    dai,
    weth,
  );
  
/*
  console.log("Fetched pair");
  console.log(pair);
*/
  route = await new Route([pair], weth);//We use route only for specifying the direction, 2nd arg is the token you buy

  trade = await new Trade(route, new TokenAmount(weth, AMOUNT_WETH.toString()), TradeType.EXACT_INPUT)

  web3.eth.subscribe('newBlockHeaders')
    .on('data', async block => {
      console.log(`New block received. Block # ${block.number}`);

      
      exPrice= await trade.executionPrice.toSignificant(DAI_DECIMALS);
      exPriceInverted= await trade.executionPrice.invert().toSignificant(DAI_DECIMALS);
      //nextMidPrice=await trade.nextMidPrice.toSignificant(DAI_DECIMALS);
      console.log(`weth/dai`);
      console.log(`Buy: ${exPrice}` );
      console.log(`Sell: ${exPriceInverted}` );

    })
    .on('error', error => {
      console.log(error);
    });
  
}
init();