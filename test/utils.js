module.exports = {
    compareBlacklists: function (_expectedBL, _actualBL, _who) {
        assert.equal(_expectedBL.length, _actualBL.length,
        "Expected length ${_actualBL.length} of ${_who}'s blacklist to equal ${_expectedBL.length}");

        let expected;
        let actual;

        for (let i = 0; i < _expectedBL.length; ++i) {
            expected = _expectedBL[i];
            actual = _actualBL[i];

            assert.equal(expected, actual,
            "Expected ${actual} in ${_who}'s blacklist to equal ${expected}");
        }
    },

    padAddr: function(_addr) {
        let nZeros = 40 - (_addr.length - 2);
        return ("0x" + "0".repeat(nZeros) + _addr.slice(2, _addr.length));
    },

    flattenPairs: function(_pairs) {
        return [].concat.apply([], _pairs);
    }
};
