import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import Navbar from './components/Navbar'
import GoogleMap from './components/GoogleMap'
import { getSolution } from './script'

import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [navShow, setNavShow] = useState(false);



  return (
    <>
      <Head>
        <title>Map for Tucil 3</title>
        <meta name="description" content="Map for Tucil 3" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Navbar show={navShow} func={() => setNavShow(!navShow)}/> 
        <GoogleMap />
      </main>
    </>
  )
}
