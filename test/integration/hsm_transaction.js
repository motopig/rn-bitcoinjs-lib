const bitcoin = require('../../')

async function main() {

    const alice = {
        publicKey: 'wallet pub key'
    }
    
    const txb = new bitcoin.TransactionBuilder()

    txb.setVersion(1)
    txb.addInput('61d520ccb74288c96bc1a2b20ea1c0d5a704776dd0164a396efec3ea7040349d', 0) // Alice's previous transaction output, has 15000 satoshis
    txb.addOutput('1cMh228HTCiwS8ZsaakH8A8wze1JR5ZsP', 12000)
    // (in)15000 - (out)12000 = (fee)3000, this is the miner fee

    await signProcess(txb, alice.publicKey, '');
    const tx = txb.build();
    const rawData = tx.toHex();
    const txId = tx.getId();
    console.log(rawData);
    console.log(txId);
    console.log('----------------------');

    return;
}

async function signProcess(txb, pubkey, signature) {
    // 模拟utxo数组
    const unspents = [1];
    
    return new Promise((resolve, reject) => {
        const len = unspents.length;
        asyncForEach(unspents, async (v,k,unspents) => {
            const source = txb.sign(k, pubkey, signature);
            const encode = await hsmSign(source)
            // todo hsm sign error process
            if (!encode) {
                reject()
            }
            // encode is a 64 length buffer
            txb.sign(k, pubkey, encode)
            if (k === (len-1)) {
                // todo
                resolve(signature+'xx');
            }
        })
        
    });

}

// 模拟 azure hsm 签名
async function hsmSign(source) {
    return new Promise((resolve, reject) => {
    setTimeout(() => {
            resolve(source);
        },3000);
    })
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}


main()