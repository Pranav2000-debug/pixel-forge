"use client";
import { SignOutButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <SignOutButton>
      <button className='bg-white text-black rounded-lg py-1.5 px-2 font-semibold float-end'>Custom sign out button</button>
    </SignOutButton>
  )
}
