export const web3SecurityCourse = {
  id: 'web3-security',
  title: 'Web3 Security Essentials',
  description: 'Master the fundamentals of staying safe in Web3 - protect your assets and avoid common scams',
  level: 'Beginner',
  duration: '2-3 weeks',
  xpReward: 600,
  modules: [
    {
      id: 'module-1',
      title: 'Wallet Security Fundamentals',
      estimatedTime: '1 week',
      chapters: [
        {
          id: 'chapter-1',
          title: 'Understanding Private Keys and Seed Phrases',
          duration: '20 min',
          content: `
## Your Keys, Your Crypto - The Golden Rule

### What Are Private Keys?
Your private key is like the master password to your crypto wallet. It's a long string of characters that proves you own your cryptocurrency. **Never share your private key with anyone!**

### Seed Phrases Explained
A seed phrase (also called a recovery phrase) is a human-readable version of your private key. It's usually 12-24 words that can restore your entire wallet.

**Example seed phrase:**
\`apple banana cherry dog elephant forest grape house island jungle kitchen lamp\`

### Critical Security Rules:
1. **Write it down offline** - Never store digitally
2. **Multiple copies** - Store in 2-3 secure locations
3. **Never photograph** - Screenshots can be hacked
4. **Test recovery** - Practice restoring your wallet
5. **Keep it private** - Not even family should know

### Real-World Example:
James lost $50,000 because he stored his seed phrase in a Google Doc that got hacked. Sarah kept hers written on paper in a safe - her crypto is still secure after 3 years.

### ⚠️ Warning:
If someone gets your seed phrase, they can steal ALL your crypto instantly. There's no "forgot password" in Web3!
          `,
          keyTakeaways: [
            'Private keys prove ownership of your crypto',
            'Seed phrases are human-readable private keys',
            'Always store seed phrases offline and securely',
            'Never share your private keys with anyone',
            'Test wallet recovery before storing large amounts'
          ],
          xpReward: 60,
          difficulty: 'easy' as const,
          tags: ['wallet-security', 'private-keys', 'seed-phrases']
        },
        {
          id: 'chapter-2',
          title: 'Hot vs Cold Wallets: Choosing the Right Storage',
          duration: '25 min',
          content: `
## Hot Wallets vs Cold Wallets: The Security Spectrum

### Hot Wallets (Connected to Internet)
**Examples:** MetaMask, Trust Wallet, Coinbase Wallet

**Pros:**
- Easy to use for daily transactions
- Quick access to DeFi and dApps
- Free to set up

**Cons:**
- Vulnerable to hacks and malware
- Connected to internet = higher risk
- Not ideal for large amounts

**Best for:** Daily trading, small amounts, DeFi interactions

### Cold Wallets (Offline Storage)
**Examples:** Ledger Nano, Trezor, Paper wallets

**Pros:**
- Maximum security (offline storage)
- Protected from online attacks
- Best for long-term holding

**Cons:**
- Less convenient for frequent use
- Cost money to purchase
- Can be lost or damaged

**Best for:** Long-term storage, large amounts, "HODL" strategy

### The Smart Strategy: Use Both!
- **Hot wallet:** Keep 5-10% for daily use
- **Cold wallet:** Store 90-95% for long-term

### Real Example:
Alex keeps $500 in MetaMask for DeFi and $10,000 on a Ledger hardware wallet. When he needs more for trading, he transfers small amounts from cold to hot storage.

### Popular Hardware Wallets:
1. **Ledger Nano S Plus** - $79, supports 5,500+ coins
2. **Trezor Model T** - $219, touchscreen interface
3. **Ledger Nano X** - $149, Bluetooth connectivity

### Setup Security Tips:
- Buy directly from manufacturer
- Verify packaging isn't tampered
- Generate new seed phrase (don't use pre-generated)
- Test with small amount first
          `,
          keyTakeaways: [
            'Hot wallets are convenient but less secure',
            'Cold wallets offer maximum security offline',
            'Use both: hot for daily use, cold for storage',
            'Hardware wallets are the gold standard for security',
            'Always buy hardware wallets from official sources'
          ],
          xpReward: 60,
          difficulty: 'easy' as const,
          tags: ['hot-wallets', 'cold-wallets', 'hardware-wallets']
        }
      ]
    },
    {
      id: 'module-2',
      title: 'Scam Detection and Prevention',
      estimatedTime: '1 week',
      chapters: [
        {
          id: 'chapter-3',
          title: 'Common Crypto Scams and Red Flags',
          duration: '30 min',
          content: `
## The Scammer's Playbook: Know Your Enemy

### 1. Phishing Attacks
**How it works:** Fake websites that look like real exchanges or wallets

**Red flags:**
- Slightly different URLs (metamask.io vs metamask.com)
- Urgent messages about "account suspension"
- Requests for seed phrases or private keys

**Real example:** Fake Uniswap site steals $8M by copying the real interface

### 2. Rug Pulls
**How it works:** Developers abandon project and steal funds

**Red flags:**
- Anonymous team with no track record
- Unrealistic promises (1000% APY)
- Locked liquidity for very short periods
- No audit or whitepaper

**Famous case:** Squid Game token - $3.3M stolen in minutes

### 3. Fake Airdrops
**How it works:** "Free" tokens that require connecting your wallet

**Red flags:**
- Too good to be true rewards
- Requires approval of all tokens
- Unknown projects with no history
- Urgent time limits

### 4. Romance/Social Engineering Scams
**How it works:** Build relationship then ask for crypto help

**Red flags:**
- New online relationship moves quickly
- Claims to be crypto expert
- Asks you to send crypto for "investment"
- Won't video call or meet in person

### 5. Fake Customer Support
**How it works:** Impersonate official support to steal credentials

**Red flags:**
- DMs you first (real support never does this)
- Asks for private keys or seed phrases
- Urgent "account verification" needed
- Poor grammar or spelling

### The Golden Rules:
1. **If it sounds too good to be true, it is**
2. **Never give out private keys or seed phrases**
3. **Always verify URLs and contracts**
4. **Research teams and projects thoroughly**
5. **Start small with new platforms**

### Verification Checklist:
- ✅ Check official social media accounts
- ✅ Verify contract addresses on official sites
- ✅ Read community discussions and reviews
- ✅ Look for security audits
- ✅ Check team backgrounds and history
          `,
          keyTakeaways: [
            'Phishing sites copy real platforms to steal credentials',
            'Rug pulls involve developers abandoning projects',
            'Fake airdrops trick users into approving malicious contracts',
            'Social engineering builds trust before stealing',
            'Always verify everything independently'
          ],
          xpReward: 60,
          difficulty: 'medium' as const,
          tags: ['scams', 'phishing', 'rug-pulls', 'social-engineering']
        },
        {
          id: 'chapter-4',
          title: 'Smart Contract Security Basics',
          duration: '25 min',
          content: `
## Smart Contracts: Trust, But Verify

### What Are Smart Contracts?
Smart contracts are programs that run on the blockchain. They automatically execute when conditions are met, but they can have bugs or malicious code.

### Common Smart Contract Risks:

#### 1. Unlimited Token Approvals
**The risk:** Approving unlimited spending can drain your wallet
**How to avoid:** 
- Only approve what you need
- Revoke approvals after use
- Use tools like Revoke.cash to check approvals

#### 2. Honeypot Contracts
**The risk:** You can buy tokens but can't sell them
**How to avoid:**
- Test with small amounts first
- Check if others have sold recently
- Use honeypot detection tools

#### 3. Unaudited Contracts
**The risk:** Bugs or backdoors in the code
**How to avoid:**
- Look for audit reports from reputable firms
- Check if code is verified on Etherscan
- Avoid brand new, unaudited protocols

### Security Tools You Should Use:

#### 1. Etherscan Contract Verification
- Always check if contract code is verified
- Look for the green checkmark
- Read the contract source code if possible

#### 2. DeFiSafety Ratings
- Rates protocols on security practices
- Scores from 0-100%
- Avoid protocols with low scores

#### 3. Token Approval Checkers
- **Revoke.cash** - See and revoke token approvals
- **Approved.zone** - Alternative approval checker
- **Etherscan** - Check approvals in your wallet

#### 4. Honeypot Detectors
- **Honeypot.is** - Check if tokens are honeypots
- **Token Sniffer** - Scam detection tool
- **RugDoc** - Project safety ratings

### Before Interacting with Any Contract:
1. ✅ Verify the contract address on official sources
2. ✅ Check if the contract is audited
3. ✅ Look for community feedback and reviews
4. ✅ Start with small test transactions
5. ✅ Understand what permissions you're granting

### Real Example:
Maria wanted to use a new DeFi protocol offering 500% APY. She checked:
- ❌ No audit found
- ❌ Anonymous team
- ❌ Contract not verified
- ❌ No major influencers using it

She decided to skip it. Two weeks later, it was revealed as a $2M rug pull.

### Emergency Response:
If you think you've interacted with a malicious contract:
1. **Immediately revoke all token approvals**
2. **Move remaining funds to a new wallet**
3. **Report the scam to the community**
4. **Learn from the experience**
          `,
          keyTakeaways: [
            'Smart contracts can have bugs or malicious code',
            'Always check for audits and verified code',
            'Revoke token approvals regularly',
            'Use security tools to verify contracts',
            'Test with small amounts first'
          ],
          xpReward: 60,
          difficulty: 'medium' as const,
          tags: ['smart-contracts', 'audits', 'token-approvals', 'security-tools']
        }
      ]
    },
    {
      id: 'module-3',
      title: 'Advanced Security Practices',
      estimatedTime: '1 week',
      chapters: [
        {
          id: 'chapter-5',
          title: 'Multi-Signature Wallets and Security Layers',
          duration: '20 min',
          content: `
## Multi-Sig: Your Crypto's Bodyguard Team

### What is a Multi-Signature Wallet?
A multi-sig wallet requires multiple signatures (approvals) to execute transactions. Think of it like a bank vault that needs multiple keys to open.

### How Multi-Sig Works:
- **2-of-3 setup:** 3 people have keys, any 2 can approve transactions
- **3-of-5 setup:** 5 people have keys, any 3 can approve transactions
- **Personal multi-sig:** You control multiple devices/keys

### Benefits:
1. **No single point of failure** - One compromised key can't drain funds
2. **Shared responsibility** - Great for teams and organizations
3. **Recovery options** - Lose one key? Others can still access funds
4. **Reduced risk** - Hackers need multiple keys to steal

### Popular Multi-Sig Solutions:
- **Gnosis Safe** - Most popular, supports many chains
- **Casa** - User-friendly for individuals
- **BitGo** - Enterprise-focused
- **Electrum** - Bitcoin multi-sig

### Setting Up Personal Multi-Sig:
1. **Hardware wallet** (Ledger/Trezor)
2. **Mobile wallet** (on secure phone)
3. **Desktop wallet** (on secure computer)

Require 2-of-3 signatures for any transaction.

### Real-World Example:
A DeFi protocol uses 4-of-7 multi-sig for their treasury. Even if 3 team members' keys are compromised, the funds remain safe.
          `,
          keyTakeaways: [
            'Multi-sig requires multiple approvals for transactions',
            'Eliminates single points of failure',
            'Great for teams and high-value storage',
            'Gnosis Safe is the most popular solution',
            'Consider 2-of-3 setup for personal use'
          ],
          xpReward: 60,
          difficulty: 'medium' as const,
          tags: ['multi-sig', 'gnosis-safe', 'security-layers']
        },
        {
          id: 'chapter-6',
          title: 'Privacy and Anonymity in Web3',
          duration: '25 min',
          content: `
## Privacy in Web3: Protecting Your Digital Footprint

### Why Privacy Matters:
- **Financial surveillance** - All transactions are public
- **Targeted attacks** - Wealthy addresses become targets
- **Personal safety** - Protect your real-world identity
- **Business confidentiality** - Keep trading strategies private

### Blockchain Privacy Challenges:
- All transactions are public and permanent
- Addresses can be linked to real identities
- Transaction patterns reveal behavior
- Metadata can expose location and timing

### Privacy Tools and Techniques:

#### 1. Address Management
- **Use multiple addresses** - Don't reuse the same address
- **Fresh addresses** - Generate new ones regularly
- **Separate purposes** - Different addresses for different activities

#### 2. Mixing Services (Use Carefully)
- **Tornado Cash** - Ethereum mixer (legal issues)
- **CoinJoin** - Bitcoin mixing
- **Aztec Network** - Privacy-focused DeFi

⚠️ **Warning:** Some mixing services face legal scrutiny. Research local laws.

#### 3. Privacy Coins
- **Monero (XMR)** - Private by default
- **Zcash (ZEC)** - Optional privacy features
- **Secret Network** - Privacy-focused smart contracts

#### 4. VPN and Tor Usage
- **Always use VPN** when accessing crypto services
- **Tor browser** for maximum anonymity
- **Avoid public WiFi** for crypto activities

### Operational Security (OpSec):

#### Digital Hygiene:
- Use dedicated devices for crypto
- Separate email addresses
- Different usernames/handles
- Avoid linking social media to crypto

#### Physical Security:
- Don't discuss crypto holdings publicly
- Avoid crypto-branded merchandise
- Be careful about social media posts
- Consider using aliases for crypto activities

### Privacy-Focused Practices:
1. **Batch transactions** - Combine multiple operations
2. **Use DEXs** - Avoid KYC exchanges when possible
3. **Time delays** - Don't move funds immediately
4. **Amount obfuscation** - Avoid round numbers
5. **Chain analysis resistance** - Break transaction patterns

### Legal Considerations:
- Privacy ≠ Illegal activity
- Know your local regulations
- Some privacy tools may be restricted
- Consult legal advice for large amounts
- Keep records for tax purposes

### Real Example:
Alex uses 5 different addresses:
- Address A: DeFi farming
- Address B: NFT trading
- Address C: Long-term holding
- Address D: Daily transactions
- Address E: Privacy-focused activities

This makes it harder to track his total holdings and activities.
          `,
          keyTakeaways: [
            'All blockchain transactions are public and permanent',
            'Use multiple addresses for different purposes',
            'VPN and Tor provide additional privacy layers',
            'Privacy tools may face legal restrictions',
            'Good OpSec protects both digital and physical security'
          ],
          xpReward: 60,
          difficulty: 'hard' as const,
          tags: ['privacy', 'anonymity', 'opsec', 'mixing', 'vpn']
        },
        {
          id: 'chapter-7',
          title: 'Incident Response and Recovery',
          duration: '20 min',
          content: `
## When Things Go Wrong: Your Emergency Action Plan

### Immediate Response Checklist:
If you suspect your wallet is compromised:

#### First 5 Minutes:
1. **STOP** - Don't panic, think clearly
2. **Disconnect** - Close all crypto apps and websites
3. **Assess** - Check wallet balances quickly
4. **Secure** - Move to a clean device if possible

#### Next 30 Minutes:
1. **New wallet** - Create fresh wallet on clean device
2. **Transfer funds** - Move remaining assets to new wallet
3. **Revoke approvals** - Use Revoke.cash to cancel permissions
4. **Change passwords** - Update all related accounts

#### Next 24 Hours:
1. **Document everything** - Screenshots, transaction hashes
2. **Report** - Notify exchanges, file police report if needed
3. **Warn others** - Alert your network about the attack
4. **Analyze** - Figure out how the breach happened

### Common Recovery Scenarios:

#### Lost Seed Phrase:
- Check all possible storage locations
- Try to remember partial phrases
- Use seed phrase recovery tools (carefully)
- Consider hiring professional recovery services
- **Prevention:** Multiple secure backups

#### Compromised Wallet:
- Create new wallet immediately
- Transfer remaining funds
- Revoke all token approvals
- Scan devices for malware
- **Prevention:** Better security practices

#### Scammed by Fake Project:
- Document all evidence
- Report to relevant authorities
- Share experience to warn others
- Check if any recovery is possible
- **Prevention:** Better due diligence

#### Exchange Hack/Bankruptcy:
- Check if funds are insured
- Join creditor groups if applicable
- Monitor legal proceedings
- Learn about exchange security
- **Prevention:** "Not your keys, not your crypto"

### Recovery Tools and Services:

#### Professional Services:
- **Wallet Recovery Services** - For lost passwords/seeds
- **Blockchain Forensics** - Track stolen funds
- **Legal Services** - For large losses
- **Insurance** - Some policies cover crypto theft

#### Self-Recovery Tools:
- **BTCRecover** - Bitcoin wallet recovery
- **Hashcat** - Password cracking tool
- **Seed phrase generators** - For partial recovery
- **Blockchain explorers** - Track transactions

### Building Resilience:

#### Backup Strategy:
- Multiple seed phrase copies
- Different physical locations
- Various storage methods
- Regular testing of backups

#### Security Layers:
- Hardware wallets for storage
- Multi-sig for large amounts
- Regular security audits
- Incident response plan

#### Education and Awareness:
- Stay updated on new threats
- Join security-focused communities
- Practice with small amounts
- Learn from others' mistakes

### Insurance Options:
- **Coinbase Insurance** - Covers hot wallet funds
- **Nexus Mutual** - DeFi insurance protocols
- **Traditional Insurance** - Some companies offer crypto coverage
- **Self-Insurance** - Diversify across multiple wallets

### Legal Considerations:
- Report significant thefts to authorities
- Keep detailed records for taxes
- Understand your jurisdiction's laws
- Consider legal action for large losses

### Psychological Recovery:
- Don't blame yourself entirely
- Learn from the experience
- Start small when rebuilding
- Join support communities
- Consider professional help for large losses

Remember: The goal isn't to never make mistakes, but to minimize their impact and learn from them.
          `,
          keyTakeaways: [
            'Have an incident response plan ready',
            'Act quickly but thoughtfully when compromised',
            'Document everything for recovery and legal purposes',
            'Multiple backups prevent total loss',
            'Learn from incidents to improve security'
          ],
          xpReward: 60,
          difficulty: 'medium' as const,
          tags: ['incident-response', 'recovery', 'backup', 'insurance']
        }
      ]
    }
  ]
};
