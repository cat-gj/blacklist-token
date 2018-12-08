module.exports = {
    compareBlacklists: function (expectedBL, actualBL, who) {
        assert.equal(expectedBL.length, actualBL.length,
        "Expected length ${actualBL.length} of ${who}'s blacklist to equal ${expectedBL.length}");

        let expected;
        let actual;

        for (let i = 0; i < expectedBL.length; ++i) {
            expected = expectedBL[i];
            actual = actualBL[i];

            assert.equal(expected, actual,
            "Expected ${actual} in ${who}'s blacklist to equal ${expected}");
        }
    },

    padAddr: function(addr) {
        let nZeros = 40 - (addr.length - 2);
        return ("0x" + "0".repeat(nZeros) + addr.slice(2, addr.length));
    }
};
