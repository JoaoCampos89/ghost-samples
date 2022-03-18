const bip39 = require('bip39');
const bip32 = require('bip32');
const bitcore = require('ghost-bitcore-lib');
const networks = bitcore.Networks;
const PrivateKey = bitcore.PrivateKey;
const PublicKey = bitcore.PublicKey;
const Transaction = bitcore.Transaction;
const Address = bitcore.Address;
const testnetUtils = require('../../testnet').testnetUtils;
// Testnet network
const NETWORK = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'tb',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0x2e,
};
// Use this network for Ghost mainnet
const ghost = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'gp',
  bip32: {
    public: 0x68df7cbd,
    private: 0x8e8ea8ea,
  },
  pubKeyHash: 0x26,
  scriptHash: 0x61,
  wif: 0xa6,
};
// Create a public transaction to broadcast
const main = async () => {
  const mnemonic =
    'praise you muffin lion enable neck grocery crumble super myself license ghost';
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed, NETWORK);
  const child = root.derivePath("m/44'/531'/0'/0/0");
  const privateKey = new PrivateKey.fromWIF(child.toWIF(), 'testnet');
  const publicKey = PublicKey(privateKey, networks.testnet);
  const address = new Address(publicKey, networks.testnet);

  const unspent = await testnetUtils.fetchUnspents(address.toString())
  const to = 'XPtT4tJWyepGAGRF9DR4AhRkJWB3DEBXT2';
  // 1 Ghost coin
  const amount = 1e8;

  const transaction = new bitcore.Transaction()
    .from(unspent)          // Feed information about what unspent outputs one can use
    .to(to, amount)  // Add an output with the given amount of satoshis
    .change(address)      // Sets up a change address where the rest of the funds will go
    .sign(privateKey)     // Signs all the inputs it can*/
  // raw tx to broadcast
  console.log(transaction.serialize());
}

main().then(console.log)