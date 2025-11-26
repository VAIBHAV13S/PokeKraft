import hre from "hardhat";

async function main() {
  console.log("Deploying PokeCraftNFT...");

  const PokeCraftNFT = await hre.ethers.getContractFactory("PokeCraftNFT");
  const nft = await PokeCraftNFT.deploy();

  await nft.waitForDeployment();

  const address = await nft.getAddress();
  console.log("PokeCraftNFT deployed to:", address);

  // Wait for a few block confirmations to ensure deployment is propagated before verification
  // (Optional but good practice for verification scripts, though we verify manually or in a separate step usually)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
