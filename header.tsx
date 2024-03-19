'use client'

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Wallet = dynamic(() => import('@/components/lucid/WalletConnect'), {  ssr: false,});  

export default function MainHeader() {
  return (
    <>
    <header className="bg-neutral-700 p-5 flex justify-between font-mono text-lg">
      <Link href="/">
          <p>STOIC</p>
      </Link>

      <nav >
        <ul className="flex flex-auto gap-x-8 ">
          <li>
            <Link href="/test">
              <p>Champion</p>
            </Link>
          </li>
        </ul>
      </nav>

      <Wallet />
    </header>

    </>
  )
}