import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
const Buffer = require('buffer').Buffer

const projectId = '2EC3BiM16hNv3X52ERrdIuaey3X';
const projectSecret = '378c038b372d57ac9b1ebe490cbebed7';
const auth =
  'Basic ' + Buffer.from(projectId + ":" + projectSecret).toString('base64');

// const body = new FormData();
// body.append('file', new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' }), 'metadata.json');

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth
  }
});


// fetch(
//   'https://ipfs.infura.io:5001/api/v0/add', {
//   // host: 'ipfs.infura.io',
//   // port: 5001,
//   // protocol: 'https',
//   method: 'POST',
//   // mode: 'no-cors',
//     headers: {
//       'Authorization': auth,
//     },
//   body: 'hello',
//   }).then(response => {
//   console.log(response.status)
// })

// client.add('Hello World').then((res) => {
//   console.log(res);
// });
// client.add('QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn').then((res) => {
//   console.log(res);
// });

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }
  async function uploadToIPFS() {
    // return 'https://file.5rs.me/group1/M02/13/7A/wKgBz1l5j4OAYDPPAAOxOme03VE444.png';
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function listNFTForSale() {
    console.log('begion to mint')
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    // const provider = new ethers.providers.StaticJsonRpcProvider("http://localhost:8545");

    // const signer = provider.getSigner()

    // const wallet = new ethers.Wallet('ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

    // const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, wallet)

    /* next, create the item */
    // debugger;
    // const price = ethers.utils.parseUnits(formInput.price, 'ether');
    // console.log(111, price);
    const price2 = ethers.utils.parseEther(formInput.price);
    console.log(222, price2);
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    // console.log(listingPrice.toString(), 'listingPrice');
    listingPrice = listingPrice.toString()
    console.log('123');
    let transaction = await contract.createToken(url, price2, { value: listingPrice })
    console.log('go');
    await transaction.wait()

    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
      </div>
    </div>
  )
}
