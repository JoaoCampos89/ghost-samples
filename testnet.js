const fetch = require('node-fetch');

const APIURL = process.env.APIURL || 'https://testnet.ghostscan.io/ghost-insight-api';

exports.testnetUtils = {
    async fetchTx(txid) {
       const response = await fetch(`${APIURL}/tx/${txid}`);
       const json =  await response.json();
       return json;
    },
    async fetchRawTx(txid) {
        const response = await fetch(`${APIURL}/rawtx/${txid}`);
        const json =  await response.json();
        return json;
     },

    async fetchUnspents(address) {
        const response = await fetch(`${APIURL}/addr/${address}/utxo`);
        const json =  await response.json();
        return json;
    },

    async fetchBalance(address) {
        const response = await fetch(`${APIURL}/addr/${address}`);
        const json =  await response.json();
        return json;
    },

    async broadcastRawTX(txRaw) {
        const body = JSON.stringify({rawtx: txRaw});
        const init = {
            method: 'POST',
            body,
            headers: { 'Content-Type': 'application/json' },
        };

        const request = new Request(`${APIURL}/tx/send`, init);
        const response = await fetch(request);
        const json =  await response.json();
        return json;
    },


}
