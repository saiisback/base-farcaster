// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Baseneko Neko
/// @notice Cozy ERC721 for your on-chain neko with simple care stats.
contract BasenekoNeko is ERC721, Ownable {
    /// @dev Emitted whenever a new neko is adopted.
    event Adopt(address indexed owner);
    /// @dev Emitted when a neko is fed.
    event Feed(address indexed owner, uint256 timestamp, uint8 newHunger);
    /// @dev Emitted when a neko is played with.
    event Play(address indexed owner, uint256 timestamp, uint8 newLove);

    uint256 private nextTokenId = 1;
    string public baseTokenURI;

    /// @dev Each address can own at most one neko; token ids are fully internal.
    mapping(address => uint256) private ownerTokenId;

    /// @dev Very small virtual-pet style stats.
    mapping(uint256 => uint8) public hunger; // 0 = full, 100 = starving
    mapping(uint256 => uint8) public love;   // 0 = sad, 100 = very loved

    constructor() ERC721("Baseneko", "NEKO") Ownable(msg.sender) {}

    /// @notice Adopt a new neko NFT. Each address can own at most one.
    /// @dev Mints a new ERC721 token to the caller and initialises stats.
    function adopt() external returns (uint256 tokenId) {
        require(ownerTokenId[msg.sender] == 0, "already adopted");

        tokenId = nextTokenId++;
        ownerTokenId[msg.sender] = tokenId;

        _safeMint(msg.sender, tokenId);

        // Start every neko in the middle.
        hunger[tokenId] = 50;
        love[tokenId] = 50;

        emit Adopt(msg.sender);
    }

    /// @notice Feed your neko to reduce hunger. Pass the owner address instead of token id.
    function feed(address owner) external {
        require(owner == msg.sender, "not your neko");

        uint256 tokenId = ownerTokenId[owner];
        require(tokenId != 0, "no neko");

        // Decrease hunger but never below 0.
        uint8 current = hunger[tokenId];
        uint8 newHunger = current > 20 ? current - 20 : 0;
        hunger[tokenId] = newHunger;

        emit Feed(owner, block.timestamp, newHunger);
    }

    /// @notice Play with your neko to increase love. Pass the owner address instead of token id.
    function play(address owner) external {
        require(owner == msg.sender, "not your neko");

        uint256 tokenId = ownerTokenId[owner];
        require(tokenId != 0, "no neko");

        // Increase love but never above 100.
        uint8 current = love[tokenId];
        uint8 newLove = current + 20 > 100 ? 100 : current + 20;
        love[tokenId] = newLove;

        emit Play(owner, block.timestamp, newLove);
    }

    /// @notice Set the base URI for metadata (used by marketplaces).
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseTokenURI = _newBaseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }
}
