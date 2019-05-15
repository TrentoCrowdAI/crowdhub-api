const accountBalanceDelegate = require('./account-balance.delegate');

test('Account-balance should return proper values', async () => {
    let response = await accountBalanceDelegate.getBalances();
    
    expect(response.f8).toBeDefined();
    expect(response.tolokaNormal).toBeDefined();
    expect(response.tolokaSandbox).toBeDefined();
});