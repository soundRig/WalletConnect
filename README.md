# WalletConnect

This is the tooling required to enable Cardano wallets to connect to the dapp.

`BMint` is some example Lucid code for a transaction
`WalletConnect` is the button that handles the wallet selection and adds to the context
`header` is an example dapp header which shows how to dynamically import `walletConnect` to the dapp
`init` is the Lucid init file
`layout` is an example for wrapping the dapp in the wallet provider
`store` is the context store which holds user data based on the connected wallet and enables global access in the dapp
