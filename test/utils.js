module.exports = {
    compareBlacklists: function (_actualBL, _expectedBL, _who) {
        assert.equal(_actualBL.length, _expectedBL.length, "Blacklist length failed");

        let expected;
        let actual;

        for (let i = 0; i < _expectedBL.length; ++i) {
            expected = _expectedBL[i];
            actual = _actualBL[i];

            assert.equal(actual, expected, "Blacklist value failed");
        }
    },

    assertErrorCode: function (_receipt, _expectedErrorCode) {
        let errorCode = _receipt.logs[0].args.err;
        assert.equal(errorCode.toNumber(), _expectedErrorCode, "Error code failed");
    },

    padAddr: function(_addr) {
        let nZeros = 40 - (_addr.length - 2);
        return ("0x" + "0".repeat(nZeros) + _addr.slice(2, _addr.length));
    },

    flattenPairs: function(_pairs) {
        return [].concat.apply([], _pairs);
    }
};
