# Decription of application
This is a blockchain website setup to easily work with any contract made using the ScamToken ERC-20 contract. Generally geared towards ticketing an event

# How to run the application
The commands to run the application are  
```
bun i
bun run dev
```
or if using node
```
npm i 
npm run dev
```
Then you go to http://localhost:5173 and have full use of the application.

# How to use the application
### The Navbar
The navbar lets you navigate the page and will automatically show and update the token and SETH balance of the selected wallet

### Choose Wallet Page
This is a place in which you can load a wallet in three different methods, creating a wallet, loading a wallet from a keystore or loading a wallet from a public private key combination. 
- Create Wallet: A simple way to input a password to create a wallet from that
- Loading from public private keys: This method lets you easily use a wallet form metamask or such in the application as you can get the public private key and input them in hex to load it in.
- Wallet from Keystore: Input password and attach keystore json to load a wallet in
There are error modals when the details inputted are incorrect and there is also a download keystore button to download the keystore of any of the three methods

### Entry
- This is the page to show the authenticity of the person trying to enter the event, it will have a delay upon clicking the entry button but will show a popup with the amount of people allowed entry to the event on it. 
- This is burning the tickets preventing all reuse and for added security there is a button to update the wallet balance and show the current wallet token balance which can further prove the change in balance to the bouncer if they wanted. 
- The update wallet balance button is there to refresh the token value at the top if the automatic refresh is too slow.

### Tickets
This page is where you can transfer, refund and buy tokens
- Buy: This is a simple method in which a user can input the amount of tokens and purchase them for SETH from the contract
- Refund: This lets users resell their tokens back to the contract returning the token for resale and paying the refunder the cost of the token. The tokens are burned on use this means that only unused tokens can be refunded
- Transfer: This allows the user to transfer tokens from the chosen wallet to another wallet

### The Personas
- The Venue: For the venue the only requirement laid out for them was to check the distribution of tickets so i have a number on the Tickets page in which it shows the number of remaining tickets and the % as the % is used to account for tokens being bured as well. No tx as the data is all public reading which needs no transaction
- The Doorman: In the entry page I felt that showing your initial balance to the doorman burning the required number of tickets in front of them and then showing the changed balance at the end would be enough. But as an added layer the doorman could ask the user to refresh the page and run through selecting a wallet to really verify the transactions so that they are definately the one in control of the wallet. 
    - Tx of burning tokens: 0x6cac23d93ba26bdd12dc4da832594c56bd3c37b42290ab2a81f596492efe5264
- The Attendee: They can transfer buy and refund/return tickets to the venue. They can use the entry page in the steps laid above to verify their authenticity and all their transactions would be on sepolia scanner as a proof of purchase as well as proof of burning if need be. 
     - Tx of buying tokens: 0xde0d4c71f900dea9dbb6e6237ed11d2d2f34c8bde5452b5dcfcc00f5990ab563 
     - Tx of transferring: 0x03ccc6eeb321876b63f333d7a7bccfccd20873da912963a1a63f0e1b8f6005e9
     - Tx of Refunding: 0x10c563d0417b4e22a19ec18394e6e63f5591569c1f66267f54e0fd732b7e4250


### Notes
- Once a wallet is chosen until changed that wallet is used for all subsequent transactions which allows users to be able to have an easier use of the application as the loading of privatekeys and addresses are automatic
- There are both error and success modals with different error messages across the applications where applicable
- There is a small issue sometimes with the wallet balance not being updated fast enough on the navbar after a transaction hence why there is the additional update wallet balance button
- The tickets page show the esimated gas cost for the transaction underneath the input fields

### The Contract
The contract has three new things compared to the intial contract you gave us
- When initialising the contract all but 10 of the tokens remain on the contract to be bought or used
- The refund function is a method to return the exact value of the tokens that were bought back to the user which cna only be done after a certain amount of transactions are made to teh contract ot ahve the balace to do that
- The burn function burns tokens and returns successful or not and reduced the total supply to reflect that as well

### The Code
Things of note in code
- After any token amount changing transaction i have a 7 second timeout before refreshing the navbar, this is to try refresh after the balance has been updated but as that is not guaranteed tp work the update balance button works too
- I use a global context provider called Web3Context to store the state of the wallet privatekey and tokenaddress meaning to change which token this works for all you need to do is change the token address variable in Web3Context
- The modal is configured to close on clicking anywhere and it has both a positive and negaive image depending on how it is called
- I have hardhat tests implemented which can be run through ``bun hardhat test`` after installing the packages needed
- The navbar has events which trigger it updating but it is not polling as to reduce the load on the computer
- The three pages which contain most of the blockchain logic are Entry.jsx, ChooseWallet.jsx and Tickets.jsx