// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract CoretoshiMock is ERC721URIStorage {
    uint256 tokenId;

    constructor() ERC721("CoretoshiMock", "CTM") {}

    function mint() external {
        _safeMint(msg.sender, tokenId);
        _setTokenURI(
            tokenId,
            "ipfs://bafkreiapbrdn4yeisk5vpu3xbzg6ezybltsrtf3spirseati3bwlyn4gcy/"
        );
        tokenId++;
    }
}