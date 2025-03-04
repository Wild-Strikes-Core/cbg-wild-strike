const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const tokenAddress = "0x6a0BD9d302Ac2909Aeab1767b336AeDB64eb2Dd8";

    const ClaimTokens = await ethers.getContractFactory("claimTokens");
    const claimTokens = await ClaimTokens.deploy(tokenAddress); // Pass the token address
    await claimTokens.waitForDeployment();

    console.log("Contract deployed to:", await claimTokens.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
