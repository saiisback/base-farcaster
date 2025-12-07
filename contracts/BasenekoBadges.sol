// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BasenekoBadges is ERC1155, Ownable {
    event BadgeMinted(address indexed to, uint256 indexed id, uint256 amount);

    string public name = "Baseneko Badges";
    string public symbol = "NEKOBADGE";

    uint256 public nextBadgeId = 1;

    // achievement label (hashed) -> badge id
    mapping(bytes32 => uint256) public achievementToBadgeId;
    // human‑readable label for each badge id, e.g. "the tutor", "neko caretaker"
    mapping(uint256 => string) public badgeLabel;

    constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {}

    // Anyone can claim a badge for a given achievement; it always mints to msg.sender.
    function mintBadgeForAchievement(string calldata achievement) external {
        bytes32 key = keccak256(bytes(achievement));
        uint256 id = achievementToBadgeId[key];

        if (id == 0) {
            id = nextBadgeId++;
            achievementToBadgeId[key] = id;
            badgeLabel[id] = achievement;
        }

        _mint(msg.sender, id, 1, "");
        emit BadgeMinted(msg.sender, id, 1);
    }

    function mintBadge(address to, uint256 id, uint256 amount) external onlyOwner {
        require(to != address(0), "invalid recipient");
        require(amount > 0, "amount must be > 0");

        _mint(to, id, amount, "");
        emit BadgeMinted(to, id, amount);
    }

    function setURI(string memory newURI) external onlyOwner {
        _setURI(newURI);
    }
}
