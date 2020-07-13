const bip39 = require('bip39');
const bip32 = require('bip32');
const bitcore = require('ghost-bitcore-lib');
const Mnemonic = require('bitcore-mnemonic');
const { FetchError } = require('node-fetch');
const HDPublicKey = bitcore.HDPublicKey;
const HDPrivateKey = bitcore.HDPrivateKey;
const networks = bitcore.Networks;
const PrivateKey = bitcore.PrivateKey;
const PublicKey = bitcore.PublicKey;
const Transaction = bitcore.Transaction;
const Address = bitcore.Address;
const testnetUtils = require('../../testnet').testnetUtils;

/** revert cold staking coins from example 2
 * To revert coldstaking coins, you list all the unspent transactions where have address or coldstaking address's and add it to the list of utxo,
 * and we spend back all of to our 256 bit address per utxo. For instance, if we have 10 utxo, we need to do 10 spend transactions to disable cold staking
 * 
 *  */
const main = async () => {
    const mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost';
    const mnemonicInstance =  new Mnemonic(mnemonic);
    const seed = mnemonicInstance.toSeed();
    const hdpriv =  HDPrivateKey.fromSeed(seed);
    const child = hdpriv.deriveChild("m/44'/531'/0'/0/0");
    const childhdpublicKey = child.hdPublicKey;
    //PGHST
    console.log(childhdpublicKey.toString()) 
    // 
    const address = Address.fromPublicKey(child.hdPublicKey.publicKey, networks.testnet, true);
    // we are sending coins back to our non 256 bit address
    const addressToSend = Address.fromPublicKey(child.hdPublicKey.publicKey, networks.testnet);
    console.log(address.toString());
    // get unspent from 256 bit address
    const unspent = await testnetUtils.fetchUnspents(address.toString());
    console.log(unspent);
    const OP_IS_COINSTAKE = 'b8'
    // we spend back to our address to disable cold staking
    // we need to do this for each unspent address which have 
    for (const un of unspent) {
       // We check for prefix on scriptPubKey if it is 'b8' OP_IS_COINSTAKE 
       const unStaking =
              un.scriptPubKey &&
              un.scriptPubKey.startsWith(OP_IS_COINSTAKE);
              //We spend back to our address all the value of this input
        if(unStaking){
            console.log('Staking input')
            //TODO: Use here a proper fee estimator
            const fee = 667;
            const amount = un.satoshis - fee;
            const transaction = new bitcore.Transaction()
                    .from(un)         
                    .to(addressToSend, amount)  
                    .change(addressToSend)      
                    .sign(child.privateKey)
            // Transaction to broadcast
            console.log(transaction.toString())
        }
    }



 
}

main().then(console.log)