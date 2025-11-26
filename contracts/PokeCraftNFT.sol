// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PokeCraftNFT is ERC721, Ownable {
    uint256 private _tokenIds;
    uint256 public constant MINT_PRICE = 0.001 ether;
    
    mapping(uint256 => string) private _tokenURIs;
    
    constructor() ERC721("PokeCraft", "PKMN") Ownable(msg.sender) {}
    
    function mint(string memory _tokenURI) public payable returns (uint256) {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(msg.sender, newTokenId);
        _tokenURIs[newTokenId] = _tokenURI;
        
        return newTokenId;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // Simple implementation: just return the stored URI
        // In production, you might want to check if the token exists
        return _tokenURIs[tokenId];
    }
    
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
