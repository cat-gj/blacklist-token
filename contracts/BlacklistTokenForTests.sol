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

    function transferForTests(address _to, uint256 _value) external returns (bool success) {
        if (banned[msg.sender][_to]) {
            emit TransferCalled(ERR_BLACKLISTED);
            return false;
        }

        success = transfer(_to, _value);

        if (success) {
            emit TransferCalled(SUCCESS);
        }
    }
}
