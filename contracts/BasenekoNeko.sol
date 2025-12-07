// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Baseneko Neko - minimal ERC721-style interface (inspiration only)
/// @notice This contract is not wired to the app yet – it is here
///         as a reference for how the on-chain Neko could look.
contract BasenekoNeko {
    /// @dev Simple event log for adopt / feed / play actions.
    event Adopt(address indexed owner, uint256 indexed tokenId);
    event Feed(address indexed owner, uint256 indexed tokenId, uint256 at);
    event Play(address indexed owner, uint256 indexed tokenId, uint256 at);

    uint256 private _nextId = 1;

    /// @dev Basic ownership mapping for inspiration.
    mapping(uint256 => address) public ownerOf;

    /// @notice Mint a new Neko for the caller.
    function adopt() external returns (uint256 tokenId) {
        tokenId = _nextId++;
        ownerOf[tokenId] = msg.sender;
        emit Adopt(msg.sender, tokenId);
    }

    /// @notice Record a feeding event on-chain.
    function feed(uint256 tokenId) external {
        require(ownerOf[tokenId] == msg.sender, "not your neko");
        emit Feed(msg.sender, tokenId, block.timestamp);
    }

    /// @notice Record a play event on-chain.
    function play(uint256 tokenId) external {
        require(ownerOf[tokenId] == msg.sender, "not your neko");
        emit Play(msg.sender, tokenId, block.timestamp);
    }
}

