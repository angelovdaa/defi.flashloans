//env constants and params
require('dotenv').config({ path: __dirname + '/.env' });

//Get provider to a chain node with infura
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.INFURA_URL_WSS)
);

//import dex tokens lists
const{tokenLists: dexTokenLists} = require('./dex_tokens');

//import smart contract interfaces (abis)
const abis = require('./abis');
//import dex main smart contract addresses
const { mainnet: mainnetAddresses } = require('./dex_mainnet_addresses');

//Create kyber liq pool contract object from abi and adress
const kyber = new web3.eth.Contract(
    abis.kyber.kyberNetworkProxy,
    mainnetAddresses.kyber.kyberNetworkProxy
);

// TODO: This must be externaly updated
const AMOUNT_1 = 1;
const AMOUNT_2 = 1;



// Listen for new block in the chain
web3.eth.subscribe('newBlockHeaders')
    .on('data', async block => {
        for (let x = 0; x < dexTokenLists.kyberTokens.kyberTokenList.length; x++) {
            const token1 = dexTokenLists.kyberTokens.kyberTokenList[x];
            for (let y = x + 1; y < dexTokenLists.kyberTokens.kyberTokenList.length; y++) {
                const token2 = dexTokenLists.kyberTokens.kyberTokenList[y];

                const pairName = token1.symbol + "/" + token2.symbol;
                const amnt1_dec = AMOUNT_1 * (10 ** token1.decimals);
                const amnt2_dec = AMOUNT_2 * (10 ** token2.decimals);

                const expectedRates = await Promise.all([

                    kyber
                        .methods
                        .getExpectedRate(
                            token1.address,//With token 1
                            token2.address,// I wanna buy token 2
                            web3.eth.abi.encodeParameter('uint256', amnt1_dec.toString())// for that amount of token 1 in it's decimals, (ex. if token 1 is ether, we should put amount in wei)
                        )
                        .call()
                    ,
                    kyber
                        .methods
                        .getExpectedRate(
                            token2.address,
                            token1.address,
                            web3.eth.abi.encodeParameter('uint256', amnt2_dec.toString())


                        )
                        .call()

                ]);
                const rate = {
                    blockNum: block.number,
                    pair: pairName,
                    buy: parseFloat(expectedRates[0].expectedRate / (10 ** token2.decimals)),
                    buy_with_slippage: parseFloat(expectedRates[0].slippageRate / (10 ** token2.decimals)),

                    sell: parseFloat(1 / (expectedRates[1].expectedRate / (10 ** token1.decimals))),
                    sell_with_slippage: parseFloat(1 / (expectedRates[1].slippageRate / (10 ** token1.decimals)))

                };
                console.log(rate);
            }
        }
    })

    .on('error', error => {
        console.log(error);
    });





