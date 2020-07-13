const bip39 = require('bip39');
const bip32 = require('bip32');
const bitcore = require('ghost-bitcore-lib');

const HDPublicKey = bitcore.HDPublicKey;
const HDPrivateKey = bitcore.HDPrivateKey;
const networks = bitcore.Networks;
const PrivateKey = bitcore.PrivateKey;
const PublicKey = bitcore.PublicKey;
const Transaction = bitcore.Transaction;
const Address = bitcore.Address;
const testnetUtils = require('../../testnet').testnetUtils;

// Generate a coldstaking address from 256 public key
const main = async () => {
 
  const coldStakingAddress = 'pparszHjaqyWE4cx5Q4Afj3TDAt5gu4yYrTTiRRcoTFt4hLtaUZRyvNE2vPehU8B8coKQifUQxC8zdg27eJQ1rmX8Mdf8HDxFRzKUHNzo2aSMidb';
  const hdpublicKey = new HDPublicKey(coldStakingAddress);
  console.log(hdpublicKey.toObject());
  const address = new Address(hdpublicKey.publicKey, networks.testnet);
  console.log(address.toString());

}

main().then(console.log)



  /*  const mnemonic =
        'praise you muffin lion enable neck grocery crumble super myself license ghost';
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdpriv =  new HDPrivateKey(seed);
    const child = hdpriv.deriveChild("m/44'/531'/0'/0/0");
    const hdpublicKey = child.hdPublicKey;
    console.log(hdpublicKey);*/

   /*
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, NETWORK);
    const child = root.derivePath("m/44'/531'/0'/0/0");
    const privateKey = new PrivateKey.fromWIF(child.toWIF(), 'testnet');
    const publicKey = new PublicKey(privateKey, networks.testnet);
    const address1 = Address.fromPublicKey(publicKey, networks.testnet);
    const address2 = Address.fromPublicKey(publicKey, networks.mainnet, true);*/

    // raw tx to broadcast
/*    console.log(address1.toString());
    console.log(address2.toString());
    console.log(publicKey.toAddress(bitcore.Networks.mainnet,true))*/