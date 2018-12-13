const utils = require("./utils");
const BlacklistTokenForTests = artifacts.require("BlacklistTokenForTests");

contract("BlacklistToken", (accounts) => {
    let blacklistToken;

    let address1 = web3.eth.accounts[0];
    let address2 = web3.eth.accounts[1];
    let address3 = web3.eth.accounts[2];
    let address4 = web3.eth.accounts[3];

    before (async () => {
        let pairs = [
            [address1, address2],
            [address3, address4]
        ];
        let flattenedPairs = utils.flattenPairs(pairs);

        blacklistToken = await BlacklistTokenForTests.new(flattenedPairs);
    })

    describe("Transfer", () => {
        it("Initial token distribution", async () => {
            let receivers = Array(5).fill([address1, address2]);
            receivers = utils.flattenPairs(receivers);
            let expectedErrorCode = 0;
            let receipt = await blacklistToken.distributeForTests(receivers);

            utils.assertErrorCode(receipt, expectedErrorCode);

            let expectedBalance = 500;
            let actualBalance1 = await blacklistToken.balanceOf(address1);
            let actualBalance2 = await blacklistToken.balanceOf(address2);

            assert.equal(actualBalance1.toNumber(), expectedBalance, "Wrong balance for address1");
            assert.equal(actualBalance2.toNumber(), expectedBalance, "Wrong balance for address2");
        })

        it("Successful transfer", async () => {
            let receipt = await blacklistToken.transferForTests(address3, 100, {from: address1});
            assert.equal(receipt.logs[0].event, "Transfer", "Should fire Transfer event");
        })

        it("Correct balances", async () => {
            let expectedBalance1 = 400;
            let actualBalance1 = await blacklistToken.balanceOf(address1);
            let expectedBalance3 = 100;
            let actualBalance3 = await blacklistToken.balanceOf(address3);

            assert.equal(actualBalance1.toNumber(), expectedBalance1, "Wrong balance for address1");
            assert.equal(actualBalance3.toNumber(), expectedBalance3, "Wrong balance for address3");
        })

        it("Transfer fails for blacklisted address", async () => {
            let expectedErrorCode = 310;
            let receipt1 = await blacklistToken.transferForTests(address2, 100, {from: address1});
            let receipt2 = await blacklistToken.transferForTests(address1, 100, {from: address2});

            utils.assertErrorCode(receipt1, expectedErrorCode);
            utils.assertErrorCode(receipt2, expectedErrorCode);
        })

        it("Prohibition is transitive", async () => {
            let addresses = [address1, address2, address3, address4];
            let expectedBlacklists = [
                [address2, address4],
                [address1, address3],
                [address4, address2],
                [address3, address1]
            ];

            for (let i = 0; i < expectedBlacklists.length; ++i) {
                let address = addresses[i];
                let expectedBlacklist = expectedBlacklists[i];
                let actualBlacklist = await blacklistToken.getBlacklist(address);

                utils.compareBlacklists(actualBlacklist, expectedBlacklist, address);
            }
        })
    })
})
