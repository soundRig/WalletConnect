'use client'

import { StoreProvider as EasyPeasyStore } from "easy-peasy";
import store from './store'
import { ReactNode } from "react"

export function StoreProvider({children}: Readonly<{children: ReactNode;}>) {
  return <EasyPeasyStore store={store}>{children}</EasyPeasyStore>
}