const utils = require("./utils");
const BlacklistTokenForTests = artifacts.require("BlacklistTokenForTests");

contract("BlacklistToken", (accounts) => {
    let blacklistToken;

    describe("Distribute initial supply", () => {
        let badLengthList = ["0x1"];
        let goodList = Array(5).fill("0x1").concat(Array(4).fill("0x2")).concat(["0x3"]);
        let emptyList = [];

        before(async () => {
            blacklistToken = await BlacklistTokenForTests.new(emptyList);
        })

        it("Bad list length", async () => {
            let expected = 0x220;
            let receipt = await blacklistToken.distributeForTests(badLengthList);

            utils.assertErrorCode(receipt, expected);
        })

        it("Success", async () => {
            let expected = 0x0;
            let receipt = await blacklistToken.distributeForTests(goodList);

            utils.assertErrorCode(receipt, expected);
        })

        it("Correct balances", async () => {
            let actualBalance;
            let expectedBalances = {
                "0x1": 500,
                "0x2": 400,
                "0x3": 100
            }

            for (account in expectedBalances) {
                actualBalance = await blacklistToken.balanceOf.call(account);
                assert.equal(actualBalance.toNumber(), expectedBalances[account], "Wrong balance");
            }
        })

        it("Already distributed", async () => {
            let expected = 0x210;
            let receipt = await blacklistToken.distributeForTests(goodList);

            utils.assertErrorCode(receipt, expected);
        })
    })
})
