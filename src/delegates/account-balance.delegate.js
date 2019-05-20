const fetch = require('node-fetch');

const config = require(__base + 'config/index');

const getBalances = async () => {
    let tolokaSandbox = await getTolokaBalance(true);
    let tolokaNormal;
    try {
        tolokaNormal = await getTolokaBalance(false);
    }
    catch (e) {
        //no normal account available
        tolokaNormal = 'not available';
    }
    let balances = {
        tolokaSandbox: tolokaSandbox,
        tolokaNormal: tolokaNormal,
        f8: await getF8Balance()
    };

    return balances;
};

const getTolokaBalance = async (sandbox) => {
    let baseUrl = sandbox ? config.toloka.sandboxEndpoint : config.toloka.baseEndpoint;
    let url = baseUrl + `requester`;

    let res = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'OAuth ' + config.toloka.accessToken
        }
    });

    if (res.status !== 200)
        throw new Error('Toloka Error: Not able to get the account balance!');

    let json = await res.json();
    return json.balance;
};

const getF8Balance = async () => {
    let url = config.f8.baseEndpoint + `account.json?key=${config.f8.apiKey}`;

    let res = await fetch(url);

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to get the account balance!');

    let json = await res.json();
    return json.balance;
};

module.exports = { getBalances };