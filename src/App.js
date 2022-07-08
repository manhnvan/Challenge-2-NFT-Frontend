import 'regenerator-runtime/runtime'
import React, { useEffect, useState } from 'react'
import { login, logout } from './utils'
import './global.css'
import miner from './assets/miner.png'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {

  const [nft, setNFT] = useState()
  const [totalSupply, setTotalSupply] = useState(0)

  useEffect(() => {
    if (window.walletConnection.isSignedIn()) {
      window.contract.nft_token({token_id: window.accountId}).then((result => {
        setNFT(result)
        console.log(result)
      }))
    } else {
      console.log('hello')
    }
    window.contract.nft_total_supply({}).then((result => setTotalSupply(result)))
  }, [])

  return (
    <div className='container mx-auto text-center'>
      <h1 className='mt-5 greeting'>Hello miner, <br /> Let's mint some your own NFT</h1>
      <div className='thumbnail mx-auto text-center'>
        {!nft ?
          <img src={miner} className="mx-auto w-1/5 mt-5" />
          :
          <img src={`${nft?.metadata?.media}`} className="mx-auto w-1/5 mt-5" />
        }
      </div>
      {
        !window.walletConnection.isSignedIn() && (
          <div className='text-center mt-10'>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded btn-lg" onClick={login}>
              Login to mint your NFT
            </button>
          </div>
        )
      }
      {
        window.walletConnection.isSignedIn() && (
          <div className='text-center mt-10'>
            {!nft ? (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded btn-lg" onClick={() => {
                window.contract.nft_mint(
                  {
                    receiver_id: window.accountId,
                    token_metadata: {}
                  },
                  "300000000000000",
                  "453050000000000000000000"
                )
              }}>
                Mint your own NFT
              </button>
            ) : (
              <button type="button" className="px-8 py-3 text-white bg-blue-300 rounded focus:outline-none">
                You are already minted your nft
              </button>
            )}
            {nft && <p className='text-inherit mt-3'>Your nft is now display in your wallet collection</p>}
          </div>
        )
      }
      <div className=''>
        <h2 className='mt-5 total-supply'>There are {totalSupply} NFT were minted</h2>
      </div>
    </div>
  )
}