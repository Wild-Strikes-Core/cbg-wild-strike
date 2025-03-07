import hre from "hardhat";
import "@nomicfoundation/hardhat-ethers";

async function mint() {
    //const contract = await hre.ethers.getContractAt("CoretoshiMock", "0x512F564bce009E8B8624FfE7a0AE6dF654d2a5f9"); // For Coretoshi Mock NFT
    const contract = await hre.ethers.getContractAt("WildStrikesMockNFT", "0x1217eC08A57a99E45090b384adCbfe1a28368230");  // For Wild Strikes Mock NFT
    await contract.mint();
}

mint().catch((error) =>{
    console.error(error);
    process.exitCode = 1;
});