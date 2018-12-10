pragma solidity ^0.4.24;

import "./BlacklistToken.sol";

contract BlacklistTokenForTests is BlacklistToken {
    constructor(address[] _bannedPairs) BlacklistToken(_bannedPairs) public {

    }

    function distributeForTests(address[] receivers) external returns (bool success) {
        if (distributed) {
            emit InitialSupplyDistribution(ERR_DISTRIBUTED);
            return false;
        }

        if (receivers.length != 10) {
            emit InitialSupplyDistribution(ERR_BAD_RECEIVERS);
            return false;
        }

        distributeInitialSupply(receivers);

        emit InitialSupplyDistribution(SUCCESS);
        return true;
    }
}
