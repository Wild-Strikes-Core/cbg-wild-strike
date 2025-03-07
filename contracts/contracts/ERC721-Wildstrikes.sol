// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract WildStrikesMockNFT is ERC721URIStorage {
    uint256 tokenId;

    constructor() ERC721("WildStrikesMockNFT", "WSM") {}

    function mint() external {
        _safeMint(msg.sender, tokenId);
        _setTokenURI(
            tokenId,
            "ipfs://bafkreic74ussvr7f3m6gmznoxibnxqksbdcauj2yvebig7kvm56lkrsnuq/"
        );
        tokenId++;
    }
}