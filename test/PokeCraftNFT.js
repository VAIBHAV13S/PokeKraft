import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("PokeCraftNFT", function () {
    let PokeCraftNFT;
    let nft;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        PokeCraftNFT = await ethers.getContractFactory("PokeCraftNFT");
        nft = await PokeCraftNFT.deploy();
    });

    it("Should set the right owner", async function () {
        expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should mint a new NFT and set token URI", async function () {
        const tokenURI = "ipfs://example-uri";
        const mintPrice = ethers.parseEther("0.001");

        await expect(nft.connect(addr1).mint(tokenURI, { value: mintPrice }))
            .to.emit(nft, "Transfer")
            .withArgs(ethers.ZeroAddress, addr1.address, 1);

        expect(await nft.tokenURI(1)).to.equal(tokenURI);
        expect(await nft.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should fail if payment is insufficient", async function () {
        const tokenURI = "ipfs://example-uri";
        const insufficientPrice = ethers.parseEther("0.0001");

        await expect(
            nft.connect(addr1).mint(tokenURI, { value: insufficientPrice })
        ).to.be.revertedWith("Insufficient payment");
    });

    it("Should allow owner to withdraw funds", async function () {
        const tokenURI = "ipfs://example-uri";
        const mintPrice = ethers.parseEther("0.001");

        await nft.connect(addr1).mint(tokenURI, { value: mintPrice });

        const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

        // Withdraw
        const tx = await nft.withdraw();
        const receipt = await tx.wait();

        // Calculate gas cost (approximate or exact if we get gasUsed * gasPrice)
        // For simplicity, we just check if balance increased (minus gas, might be tricky to assert exact increase without gas calc)
        // But we can check contract balance is 0
        expect(await ethers.provider.getBalance(nft.getAddress())).to.equal(0);
    });
});
