// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Baseneko Badges - minimal ERC1155-style inspiration
/// @notice This is a lightweight “inspo” contract mirroring the 3 badges
///         described in the design doc. It is not wired to the frontend yet.
contract BasenekoBadges {
    /// @dev Badge IDs: 1 = First Words, 2 = The Scholar, 3 = Best Parent.
    mapping(uint256 => mapping(address => uint256)) public balanceOf;

    event BadgeMinted(address indexed to, uint256 indexed id, uint256 amount);

    /// @notice Mint a specific badge to a user.
    /// @dev In a real deployment, access control + game logic would gate this.
    function mintBadge(address to, uint256 id, uint256 amount) external {
        require(id >= 1 && id <= 3, "invalid badge id");
        balanceOf[id][to] += amount;
        emit BadgeMinted(to, id, amount);
    }
}

