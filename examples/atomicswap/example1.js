const bitcore = require('ghost-bitcore-lib');
const testnetUtils = require('../../testnet').testnetUtils;
const bitcoin = require('bitcoinjs-lib');

const network = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'tghost',
  bip32: {
    public: 0xe1427800,
    private: 0x04889478,
  },
  pubKeyHash: 0x4B,
  scriptHash: 0x89,
  wif: 0x2e,
}


const ghostPrivateKey = '7t11QgT9Agejva6MttnPXRFkvkxc3x3Yqa1MsbG7Xfx16mkyqgFu';

const signTransaction = (data, inputIndex = 0) => {
  const { script, tx, secret } = data
  console.log(secret);
  const scriptData = bitcoin.payments.p2sh({ redeem: { output: script, network: network }, network: network })

  console.log(scriptData);

  const hashType = bitcoin.Transaction.SIGHASH_ALL
  const privKey = bitcoin.ECPair.fromWIF(ghostPrivateKey, network)

  const signatureHash = bitcore.Transaction.Sighash.sighash(tx, hashType, inputIndex, scriptData.redeem.output);

  const redeemScriptSig = bitcoin.payments.p2sh({
    network: network,
    redeem: {
      network: network,
      output: scriptData.redeem.output,
      input: bitcoin.script.compile([
        bitcoin.script.signature.encode(privKey.sign(signatureHash), hashType),
        privKey.publicKey,
        Buffer.from(secret.replace(/^0x/, ''), 'hex'),
      ])
    }
  }).input
 /* const signature = bitcore.crypto.Signature.fromBuffer(redeemScriptSig);

  const witness = [BufferUtil.concat([
    signature.toDER(),
    BufferUtil.integerAsSingleByteBuffer(signature.sigtype)
  ]),
  privKey.publicKey];

  console.log(redeemScriptSig);
  console.log(inputIndex);*/

   tx.inputs[inputIndex].setWitnesses([redeemScriptSig, scriptData.redeem.output]);
//  tx.inputs[inputIndex].setWitnesses(witness);
}

const createScript = ( hashName = 'ripemd160') => {
  const lockTime = 1594760247;
  const ownerPublicKey = "025685cc4375138e6f326140f46783928c5553201bf85876331427f068c988caf7";
  const recipientPublicKey =  "0284931012eb8e7df0d18260008e977278e88356996a609a4485560f05f3a31a7f";
  const secretHash = "6c2fade385492d0f747ffc346cb95a68625c50ca"


  const hashOpcodeName = `OP_${hashName.toUpperCase()}`
  const hashOpcode = bitcoin.opcodes[hashOpcodeName]

  const script = bitcoin.script.compile([

    hashOpcode,
    Buffer.from(secretHash, 'hex'),
    bitcoin.opcodes.OP_EQUALVERIFY,

    Buffer.from(recipientPublicKey, 'hex'),
    bitcoin.opcodes.OP_EQUAL,
    bitcoin.opcodes.OP_IF,

    Buffer.from(recipientPublicKey, 'hex'),
    bitcoin.opcodes.OP_CHECKSIG,

    bitcoin.opcodes.OP_ELSE,

    bitcoin.script.number.encode(lockTime),
    bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
    bitcoin.opcodes.OP_DROP,
    Buffer.from(ownerPublicKey, 'hex'),
    bitcoin.opcodes.OP_CHECKSIG,

    bitcoin.opcodes.OP_ENDIF,
  ])
  return script;
}


/**
 *  Withdraw Step on atomic swap transaction
 * 
 * 
 */
 const main = async () => {
    const scriptAddress = 'xQLqQX8oRgfqawMZrK6mRn3BrwpBrMiiEd';
    const feeValue = 7559;
    const destAddress = 'XE1JCTqLk5Bt6Jre9783K5y6sZM2QuqN1n';
    const secret = '0x759cbfef5148811b4660f84f5d0a138984bbeb0a6a181f074002881cea93cb8d';
    const script = createScript();
    const isRefund = false;

     const unspents = await testnetUtils.fetchUnspents(scriptAddress)
     console.log(unspents);
  
     const totalUnspent = unspents.reduce((summ, { satoshis }) => summ + satoshis, 0)

      const tx = new bitcore.Transaction();
 
      if (isRefund) {
        tx.lockUntilDate(scriptValues.lockTime);
      }
      console.log(unspents)
      tx.from(unspents);
      tx.to(destAddress, totalUnspent - feeValue);
    
      console.log(tx.toObject())
       // Sign input witness's
      tx.inputs.map((_, index) => 
        signTransaction({
          script,
          secret,
          tx,
        }, index)
       
       );
    
    const txHex = tx.toString()
    console.log(txHex);
 }

 main().then(console.log)