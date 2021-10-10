import {BigNumber, ethers, Wallet} from "ethers";

import {quickRouterAbi} from "./abi.js";

//Provider Signer 
const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");

const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
const account = signer.connect(provider)
const addresses = {
    quickRouter: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
}
// Contract
const quickRouterRead = new ethers.Contract(addresses.quickRouter, ['function getAmountsOut(uint amountIn, address[] memory path) public view returns(uint[] memory amounts)',], account);
const quickRouterWrite = new ethers.Contract(addresses.quickRouter, ['function getAmountsOut(uint amountIn, address[] memory path) public view returns(uint[] memory amounts)',], account);

const tokens = {
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    WETH: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    WMATIC: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    USDC: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    MiMATIC: "0xa3Fa99A148fA48D14Ed51d610c367C61876997F1",
    USDT: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
};

const amountsIn = {
    USDC: ethers.utils.parseUnits("1", 6),
    ETH: ethers.utils.parseUnits("1", 18),
    rack: ethers.utils.parseUnits("100", 18)

}

// pull data
// todo: price of eth/usdc, price of usdc/altcoin, price of altcoin/eth; user balance of eth;

const printStatement = (amountIn, tokenIn, tokenOut, amountOut) => {
    const profit = amountOut.sub(amountIn)
    console.log(
        `Arbitraging ${tokenIn} against ${tokenOut}
        ==================================================
        In: ${amountIn.toString()}
        Out: ${amountOut.toString()}
        Profit: ${profit.toString()}
        `
    )
}

const getPriceData = async (amountIn, tokenIn, tokenOut) => {
    const path = [tokenIn, tokenOut]
    const counterPath = [tokenOut, tokenIn]
    const amountsOut =  await quickRouterRead.getAmountsOut(amountIn, path);
    const amountsOutCounterTrade =  await quickRouterRead.getAmountsOut(amountsOut[1], counterPath)
    const amountOutCounterTrade = amountsOutCounterTrade[1];
    const loggie = printStatement(amountIn, tokenIn, tokenOut, amountOutCounterTrade);
};

//main
getPriceData(amountsIn.ETH, tokens.WETH, tokens.USDC);