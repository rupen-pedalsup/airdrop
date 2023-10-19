const hre = require("hardhat");

async function main() {
  const simbaToken = await hre.ethers.deployContract("Simba");
  await simbaToken.waitForDeployment();
  console.log("Simba token deployed to:", simbaToken.target);

  const airdrop = await hre.ethers.deployContract("Airdrop", [
    simbaToken.target,
  ]);
  await airdrop.waitForDeployment();
  console.log("Airdrop deployed to:", airdrop.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0xd7246630Dcf06AAA9f3A8AD0B54091DfD6ae12D9 simba
// 0x1559F2A4679aa2B896E8d013a54E1103097091Bc airdrop
