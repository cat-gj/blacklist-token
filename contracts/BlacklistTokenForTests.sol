pragma solidity ^0.4.24;

import "./BlacklistToken.sol";

contract BlacklistTokenForTests is BlacklistToken {
    constructor(address[] _bannedPairs) BlacklistToken(_bannedPairs) public {

    }

    function distributeForTests(address[] _receivers) external returns (bool success) {
        if (distributed) {
            emit InitialSupplyDistribution(ERR_DISTRIBUTED);
            return false;
        }

        if (_receivers.length != 10) {
            emit InitialSupplyDistribution(ERR_BAD_RECEIVERS);
            return false;
        }

        distributeInitialSupply(_receivers);

        emit InitialSupplyDistribution(SUCCESS);
        return true;
    }

    function approveForTests(address _spender, uint256 _value) external returns (bool success) {
        if (blacklisted(msg.sender, _spender)) {
            emit ApproveCalled(ERR_BLACKLISTED);
            return false;
        }

        success = approve(_spender, _value);

        if (success) {
            emit ApproveCalled(SUCCESS);
        }
    }
}
