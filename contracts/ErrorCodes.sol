pragma solidity ^0.4.24;

contract ErrorCodes {
    uint constant SUCCESS = 0;

    // Constructor
    uint constant ERR_BAD_BANNED_PAIRS = 100;

    // Distribution
    uint constant ERR_DISTRIBUTED = 210;
    uint constant ERR_BAD_RECEIVERS = 220;

    // Transfers
    uint constant ERR_BLACKLISTED = 310;

    uint constant DUMMY = 0xdeadbeef;
}
