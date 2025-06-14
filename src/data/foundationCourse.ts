
export const foundationCourse = {
  id: 'foundation',
  title: 'Crypto Foundation',
  description: 'Master the fundamentals of cryptocurrency and blockchain technology',
  longDescription: 'Build a solid foundation in cryptocurrency concepts, blockchain technology, and digital asset fundamentals. This course covers everything from basic terminology to understanding how different cryptocurrencies work.',
  level: 'Foundation' as const,
  duration: '2-3 weeks',
  color: 'from-blue-400 to-blue-600',
  gradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
  prerequisites: [],
  learningOutcomes: [
    'Understand blockchain technology fundamentals',
    'Learn about different types of cryptocurrencies',
    'Master wallet setup and security best practices',
    'Understand market dynamics and trading basics'
  ],
  totalXP: 500,
  difficulty: 1,
  category: 'fundamentals' as const,
  skills: ['Blockchain Basics', 'Crypto Security', 'Wallet Management', 'Market Understanding'],
  certification: {
    available: true,
    requirements: ['Complete all modules', 'Pass final assessment'],
    credentialName: 'Crypto Foundation Certificate'
  },
  xpReward: 500,
  modules: [
    {
      id: 1,
      title: 'Blockchain Fundamentals',
      description: 'Understanding the technology behind cryptocurrencies',
      estimatedTime: '1 week',
      xpReward: 150,
      chapters: [
        {
          id: 1,
          title: 'What is Blockchain?',
          duration: '30 min',
          content: `
## Understanding Blockchain Technology

### What is a Blockchain?

A **blockchain** is a distributed digital ledger that records transactions across multiple computers in a way that makes it extremely difficult to change, hack, or cheat the system.

**Key Characteristics:**
• **Decentralized:** No single point of control
• **Transparent:** All transactions are visible to network participants
• **Immutable:** Once recorded, data cannot be easily altered
• **Secure:** Cryptographic hashing protects data integrity

### How Blockchain Works

**Block Structure:**
Each block contains:
• **Transaction data:** Records of transfers or smart contract executions
• **Timestamp:** When the block was created
• **Hash:** A unique digital fingerprint of the block
• **Previous hash:** Links to the previous block, creating the "chain"

**The Chain Process:**
1. **Transaction initiation:** User requests a transaction
2. **Network verification:** Network nodes validate the transaction
3. **Block creation:** Verified transactions are bundled into a block
4. **Consensus:** Network agrees on the new block's validity
5. **Block addition:** New block is added to the chain
6. **Distribution:** Updated blockchain is distributed across the network

### Types of Blockchain Networks

**Public Blockchains:**
• **Examples:** Bitcoin, Ethereum
• **Access:** Open to everyone
• **Control:** Fully decentralized
• **Security:** High (many participants)

**Private Blockchains:**
• **Examples:** Corporate internal networks
• **Access:** Restricted to specific organizations
• **Control:** Centralized governance
• **Security:** Depends on internal controls

**Consortium Blockchains:**
• **Examples:** Banking consortiums
• **Access:** Semi-decentralized
• **Control:** Shared among group members
• **Security:** Moderate to high

### Real-World Applications

**Financial Services:**
• **Cross-border payments:** Faster, cheaper international transfers
• **Trade finance:** Streamlined documentation and verification
• **Identity verification:** Secure, tamper-proof identity records

**Supply Chain:**
• **Product tracking:** End-to-end visibility of goods
• **Authenticity verification:** Combat counterfeit products
• **Compliance:** Automated regulatory reporting

**Healthcare:**
• **Medical records:** Secure, interoperable patient data
• **Drug traceability:** Combat counterfeit medications
• **Clinical trials:** Transparent, verifiable research data
          `,
          keyTakeaways: [
            'Blockchain is a distributed ledger technology that provides transparency and security',
            'Each block contains transaction data and is linked to previous blocks through cryptographic hashes',
            'Different types of blockchains serve different purposes: public, private, and consortium',
            'Blockchain applications extend far beyond cryptocurrency to supply chain, healthcare, and more'
          ],
          xpReward: 50,
          difficulty: 'easy' as const,
          tags: ['blockchain', 'fundamentals', 'technology']
        },
        {
          id: 2,
          title: 'Cryptocurrency Basics',
          duration: '25 min',
          content: `
## Introduction to Cryptocurrency

### What is Cryptocurrency?

**Cryptocurrency** is a digital or virtual currency that uses cryptography for security and operates independently of traditional banking systems.

**Key Features:**
• **Digital-only:** Exists only in electronic form
• **Cryptographically secured:** Protected by advanced encryption
• **Decentralized:** Not controlled by governments or central banks
• **Peer-to-peer:** Direct transactions between users
• **Limited supply:** Most have predetermined maximum quantities

### How Cryptocurrency Works

**Digital Wallets:**
• **Public key:** Your "account number" that others can see
• **Private key:** Your secret "password" that controls your funds
• **Address:** A shortened version of your public key for receiving funds

**Transaction Process:**
1. **Initiation:** You decide to send cryptocurrency to someone
2. **Signing:** You use your private key to authorize the transaction
3. **Broadcasting:** Transaction is sent to the network
4. **Verification:** Network participants verify the transaction's validity
5. **Confirmation:** Transaction is included in a block and added to the blockchain
6. **Completion:** Recipient can now access the transferred funds

### Major Cryptocurrencies

**Bitcoin (BTC):**
• **Purpose:** Digital gold, store of value
• **Created:** 2009 by Satoshi Nakamoto
• **Supply:** Limited to 21 million coins
• **Use case:** Peer-to-peer digital cash

**Ethereum (ETH):**
• **Purpose:** Platform for smart contracts and decentralized applications
• **Created:** 2015 by Vitalik Buterin
• **Supply:** No fixed limit, but controlled issuance
• **Use case:** Programmable money and dApp platform

**Other Notable Cryptocurrencies:**
• **Litecoin (LTC):** "Silver to Bitcoin's gold"
• **Cardano (ADA):** Research-driven blockchain platform
• **Solana (SOL):** High-speed, low-cost blockchain
• **Polkadot (DOT):** Multi-chain interoperability platform

### Cryptocurrency vs. Traditional Money

**Advantages of Cryptocurrency:**
• **Global accessibility:** Send money anywhere, anytime
• **Lower fees:** Especially for international transfers
• **Financial inclusion:** Banking for the unbanked
• **Transparency:** All transactions are publicly viewable
• **Programmability:** Smart contracts enable automated agreements

**Challenges:**
• **Volatility:** Prices can fluctuate dramatically
• **Scalability:** Some networks are slow during high usage
• **Energy consumption:** Some consensus mechanisms use significant energy
• **Regulatory uncertainty:** Government policies are still evolving
• **User experience:** Can be complex for non-technical users
          `,
          keyTakeaways: [
            'Cryptocurrency is digital money secured by cryptography and operating on blockchain networks',
            'Transactions are authorized by private keys and verified by network participants',
            'Bitcoin pioneered digital currency, while Ethereum introduced programmable smart contracts',
            'Cryptocurrencies offer global accessibility and lower fees but face challenges with volatility and complexity'
          ],
          xpReward: 50,
          difficulty: 'easy' as const,
          tags: ['cryptocurrency', 'bitcoin', 'ethereum', 'digital-money']
        }
      ]
    },
    {
      id: 2,
      title: 'Wallet Security & Management',
      description: 'Learn to safely store and manage your cryptocurrency',
      estimatedTime: '1 week',
      xpReward: 175,
      chapters: [
        {
          id: 3,
          title: 'Types of Crypto Wallets',
          duration: '35 min',
          content: `
## Cryptocurrency Wallet Types and Security

### Understanding Crypto Wallets

A **cryptocurrency wallet** doesn't actually store your coins—it stores the private keys that give you access to your cryptocurrency on the blockchain.

**Wallet Components:**
• **Public key:** Your "account number" for receiving funds
• **Private key:** Your secret key that controls your funds
• **Seed phrase:** A backup method to restore your wallet
• **Address:** A shortened version of your public key

### Hot Wallets (Connected to Internet)

**Software Wallets:**

**Desktop Wallets:**
• **Examples:** Electrum, Exodus, Atomic Wallet
• **Pros:** Full control, feature-rich, good for regular use
• **Cons:** Vulnerable to malware, requires device security
• **Best for:** Active traders and regular users

**Mobile Wallets:**
• **Examples:** Trust Wallet, Coinbase Wallet, MetaMask Mobile
• **Pros:** Convenient, portable, easy to use
• **Cons:** Phone security risks, smaller screens
• **Best for:** Daily transactions and DeFi interactions

**Web Wallets:**
• **Examples:** MetaMask, MyEtherWallet, Phantom
• **Pros:** Accessible from any device, no downloads
• **Cons:** Browser security risks, phishing vulnerability
• **Best for:** DeFi applications and quick access

**Exchange Wallets:**
• **Examples:** Coinbase, Binance, Kraken wallets
• **Pros:** Easy trading integration, user-friendly
• **Cons:** Not your keys, exchange risks, limited control
• **Best for:** Beginners and active traders (small amounts only)

### Cold Wallets (Offline Storage)

**Hardware Wallets:**
• **Examples:** Ledger Nano S/X, Trezor, KeepKey
• **Pros:** Maximum security, offline storage, backup options
• **Cons:** Cost money, less convenient for frequent use
• **Best for:** Long-term storage of significant amounts

**Paper Wallets:**
• **Method:** Private keys printed on paper
• **Pros:** Completely offline, no digital attack surface
• **Cons:** Physical damage risk, easy to lose, complex setup
• **Best for:** Long-term storage (advanced users only)

### Wallet Security Best Practices

**Private Key Security:**
• **Never share:** Your private keys should never be shared with anyone
• **Multiple backups:** Store seed phrases in multiple secure locations
• **Physical security:** Protect written backups from theft and damage
• **Digital security:** Use strong passwords and two-factor authentication

**Seed Phrase Management:**
• **Write it down:** Use pen and paper, not digital storage
• **Verify accuracy:** Double-check every word and its order
• **Secure storage:** Fireproof safes, safety deposit boxes
• **Split storage:** Consider storing in multiple secure locations
• **Regular checks:** Verify backups are still readable and accurate

**Common Security Mistakes:**
• **Phishing sites:** Always verify website URLs before entering seed phrases
• **Public WiFi:** Avoid accessing wallets on unsecured networks
• **Software downloads:** Only download wallets from official sources
• **Social engineering:** Be wary of anyone asking for your private information
• **Outdated software:** Keep wallet software updated for security patches

### Multi-Signature Wallets

**How Multi-Sig Works:**
• **Multiple keys:** Requires multiple private keys to authorize transactions
• **Threshold signatures:** Example: 2-of-3 keys needed to spend
• **Shared control:** Useful for businesses or shared accounts
• **Enhanced security:** No single point of failure

**Use Cases:**
• **Business accounts:** Require multiple executives to approve large transactions
• **Family savings:** Shared control between family members
• **Estate planning:** Ensure access to funds if something happens to you
• **DAOs:** Decentralized autonomous organization treasuries
          `,
          keyTakeaways: [
            'Wallets store private keys, not actual cryptocurrency—your keys control your funds',
            'Hot wallets are convenient but less secure; cold wallets are secure but less convenient',
            'Hardware wallets provide the best security for long-term storage of significant amounts',
            'Seed phrase backup and security is crucial—losing it means losing access to your funds forever'
          ],
          xpReward: 75,
          difficulty: 'medium' as const,
          tags: ['wallets', 'security', 'private-keys', 'hardware-wallets']
        }
      ]
    }
  ]
};
