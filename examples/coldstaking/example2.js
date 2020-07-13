const bip39 = require('bip39');
const bip32 = require('bip32');
const bitcore = require('ghost-bitcore-lib');
const Mnemonic = require('bitcore-mnemonic');
const Output = require('ghost-bitcore-lib/lib/transaction/output');
const HDPrivateKey = bitcore.HDPrivateKey;
const networks = bitcore.Networks;
const Address = bitcore.Address;
const testnetUtils = require('../../testnet').testnetUtils;

/** start zap cold staking 
 * To coldstaking coins, you list all the unspent transactions from the 256 bit address and spend it to cold stake script hash
 * You need your 256 bit address to have coins in order to zap
 *  */
const main = async () => {
    const mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost';
    const mnemonicInstance =  new Mnemonic(mnemonic);
    const seed = mnemonicInstance.toSeed();
    const hdpriv =  HDPrivateKey.fromSeed(seed, networks.testnet);
    console.log(hdpriv.toObject());
    const child = hdpriv.deriveChild("m/44'/531'/0'/0/0");
    // generate 256 bit address
    const address = Address.fromPublicKey(child.hdPublicKey.publicKey, networks.testnet, true);
    console.log(address.toString());
    // get unspent from 256 bit address
     const unspent = await testnetUtils.fetchUnspents(address.toString());
     console.log(unspent);
     const OP_IS_COINSTAKE = 'b8'
    // we need to filter all unspent inputs that are not script pubkeys with OP IS COINSTAKE
    const unspentFiltered = unspent.filter( u =>   u.scriptPubKey && !u.scriptPubKey.startsWith(OP_IS_COINSTAKE) )
    if(!unspentFiltered.length){
        console.log('no inputs for zap');
        return;
    }

    console.log(unspentFiltered);
    // send all amount to script
    const amountToSpend = unspentFiltered.map( u => Number(u.satoshis) ).reduce( (p,c) => p + c)
    // use fee suitable when in mainnet
    const fee = 667;
    const amount = amountToSpend - fee;
    const coldStakingAddress = 'pparszHjaqyWE4cx5Q4Afj3TDAt5gu4yYrTTiRRcoTFt4hLtaUZRyvNE2vPehU8B8coKQifUQxC8zdg27eJQ1rmX8Mdf8HDxFRzKUHNzo2aSMidb';

    const hdpublicKey = new bitcore.HDPublicKey(coldStakingAddress);
    const addr = new Address(hdpublicKey.publicKey, networks.testnet);
    // send all coins to script address
    const script = bitcore.Script.fromAddress(address, addr.toString());
    const output = new Output({
        satoshis: amount,
        script: script,
    })
    console.log(child.privateKey)

    // For Zap is better split in multiple outputs to coldstake address
    const transaction = new bitcore.Transaction()
    .from(unspentFiltered)          // Feed information about what unspent outputs one can use
    .addOutput(output)  // Add an output with the given amount of satoshis
    .change(address)      // Sets up a change address where the rest of the funds will go
    .sign(child.privateKey)     // Signs all the inputs it can*/
    // broadcast this value
    console.log(transaction.toString())
  
}

main().then(console.log)