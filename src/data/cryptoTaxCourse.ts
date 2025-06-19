export const cryptoTaxCourse = {
  id: 'crypto-tax',
  title: 'Crypto Tax & Legal Basics',
  description: 'Navigate the complex world of cryptocurrency taxation and legal compliance',
  level: 'Beginner',
  duration: '2 weeks',
  xpReward: 550,
  modules: [
    {
      id: 'module-1',
      title: 'Understanding Crypto Taxation',
      estimatedTime: '1 week',
      chapters: [
        {
          id: 'chapter-1',
          title: 'Crypto Tax Fundamentals and Taxable Events',
          duration: '30 min',
          content: `
## Crypto Taxes: What You Need to Know

### Why Crypto Taxes Matter:
- **Legal requirement** - Most countries tax crypto gains
- **Penalties** - Failure to report can result in fines and interest
- **Audit risk** - Crypto transactions are increasingly tracked
- **Peace of mind** - Proper compliance reduces stress and risk

### Key Tax Concepts:

#### Capital Gains vs Income:
**Capital Gains:**
- Profit from selling crypto for more than you paid
- **Short-term** (<1 year): Taxed as ordinary income
- **Long-term** (>1 year): Lower tax rates (0%, 15%, or 20% in US)

**Income:**
- Receiving crypto as payment for services
- Mining rewards
- Staking rewards
- Airdrops and forks
- Taxed at ordinary income rates

### Taxable Events (When You Owe Taxes):

#### 1. Selling Crypto for Fiat
**Example:** Sell 1 BTC for $45,000 (bought for $30,000)
**Tax:** Capital gains on $15,000 profit
**Rate:** Depends on holding period and income level

#### 2. Trading Crypto for Crypto
**Example:** Trade 1 ETH for 100 LINK tokens
**Tax:** Capital gains on ETH based on fair market value
**Common mistake:** Many think crypto-to-crypto trades aren't taxable

#### 3. Using Crypto for Purchases
**Example:** Buy coffee with Bitcoin
**Tax:** Capital gains on the Bitcoin used
**Calculation:** Coffee price minus Bitcoin's cost basis

#### 4. Receiving Crypto as Income
**Examples:**
- Salary paid in crypto
- Freelance work payments
- Mining rewards
- Staking rewards
**Tax:** Ordinary income at fair market value when received

#### 5. DeFi Activities
**Taxable DeFi events:**
- Swapping tokens on DEXs
- Providing liquidity (may be taxable)
- Claiming farming rewards
- Borrowing against crypto (potentially)

#### 6. Airdrops and Forks
**Airdrops:** Generally taxable as income when received
**Forks:** Taxable when you gain control of new coins
**Amount:** Fair market value at time of receipt

### Non-Taxable Events:

#### 1. Buying Crypto with Fiat
**Example:** Buy Bitcoin with USD
**Tax:** No immediate tax consequences
**Note:** Establishes cost basis for future sales

#### 2. Transferring Between Your Own Wallets
**Example:** Move Bitcoin from exchange to hardware wallet
**Tax:** No taxable event
**Note:** Keep records of transfers

#### 3. Holding Crypto (Unrealized Gains)
**Example:** Bitcoin increases in value but you don't sell
**Tax:** No tax until you sell or trade
**Note:** "Paper gains" aren't taxed

### Cost Basis and Accounting Methods:

#### What is Cost Basis?
The original purchase price plus any fees
**Example:** Buy 1 ETH for $2,000 + $10 fee = $2,010 cost basis

#### FIFO (First In, First Out)
- Sell oldest crypto first
- **Pros:** Simple, widely accepted
- **Cons:** May result in higher taxes in bull markets

#### LIFO (Last In, First Out)
- Sell newest crypto first
- **Pros:** May reduce taxes in some situations
- **Cons:** Not allowed in all jurisdictions

#### Specific Identification
- Choose which specific coins to sell
- **Pros:** Maximum tax optimization
- **Cons:** Requires detailed record-keeping

### International Considerations:

#### United States:
- **Reporting threshold:** Any crypto activity must be reported
- **Forms:** 8949, Schedule D, possibly others
- **Rates:** 0-37% depending on income and holding period

#### United Kingdom:
- **Annual exemption:** £12,300 (2022-23)
- **Rates:** 10% or 20% for capital gains
- **Income:** Taxed at marginal rates

#### Canada:
- **Treatment:** 50% of capital gains are taxable
- **Business income:** Full taxation if trading professionally
- **Reporting:** Schedule 3 of tax return

#### European Union:
- **Varies by country:** Each EU member has different rules
- **Germany:** No tax on crypto held >1 year
- **Portugal:** No capital gains tax for individuals

#### Australia:
- **CGT:** Capital gains tax applies
- **Discount:** 50% discount for assets held >1 year
- **Personal use:** Purchases <$10,000 may be exempt

### Common Tax Mistakes:

#### 1. Not Reporting Crypto-to-Crypto Trades
**Mistake:** Thinking only fiat sales are taxable
**Reality:** All trades create taxable events
**Solution:** Track every transaction

#### 2. Poor Record Keeping
**Mistake:** Not tracking purchase dates and prices
**Reality:** You need detailed records for accurate reporting
**Solution:** Use crypto tax software

#### 3. Ignoring Small Transactions
**Mistake:** Not reporting small trades or purchases
**Reality:** All transactions count, regardless of size
**Solution:** Automate tracking with software

#### 4. Misunderstanding DeFi Taxation
**Mistake:** Thinking DeFi is tax-free
**Reality:** Most DeFi activities are taxable
**Solution:** Consult with crypto tax professionals

#### 5. Not Planning for Tax Payments
**Mistake:** Spending all crypto gains without saving for taxes
**Reality:** You owe taxes even if you reinvested gains
**Solution:** Set aside 20-40% of gains for taxes

### Record-Keeping Requirements:
- **Date** of each transaction
- **Type** of transaction (buy, sell, trade, etc.)
- **Amount** of crypto involved
- **Fair market value** in local currency
- **Cost basis** of crypto sold/traded
- **Fees** paid for transactions
- **Wallet addresses** and exchange information

### Getting Professional Help:
**When to consult a tax professional:**
- Complex DeFi activities
- Large crypto holdings
- Business crypto activities
- International tax situations
- Audit or investigation concerns

**Types of professionals:**
- **CPAs** with crypto experience
- **Crypto tax specialists**
- **Tax attorneys** for complex situations
- **Enrolled agents** for IRS representation
          `,
          keyTakeaways: [
            'Most crypto activities create taxable events',
            'Crypto-to-crypto trades are generally taxable',
            'Proper record-keeping is essential for compliance',
            'Tax rules vary significantly by country',
            'Professional help is valuable for complex situations'
          ],
          xpReward: 70,
          difficulty: 'medium' as const,
          tags: ['crypto-taxes', 'taxable-events', 'capital-gains', 'record-keeping']
        },
        {
          id: 'chapter-2',
          title: 'Tax Software and Record-Keeping Tools',
          duration: '25 min',
          content: `
## Tools for Crypto Tax Compliance

### Why Use Crypto Tax Software?

#### Manual Tracking Challenges:
- **Volume:** Hundreds or thousands of transactions
- **Complexity:** Multiple exchanges, wallets, and DeFi protocols
- **Calculations:** Complex cost basis and gain/loss calculations
- **Time:** Manual tracking can take weeks
- **Errors:** High risk of mistakes in manual calculations

#### Software Benefits:
- **Automation:** Import transactions from exchanges and wallets
- **Accuracy:** Automated calculations reduce errors
- **Compliance:** Generate proper tax forms
- **Time-saving:** Hours instead of weeks
- **Updates:** Stay current with changing tax laws

### Top Crypto Tax Software:

#### 1. CoinTracker
**Best for:** Beginners and intermediate users
**Pricing:** Free for <25 transactions, $59-$999/year
**Features:**
- Supports 300+ exchanges
- Real-time portfolio tracking
- Tax loss harvesting suggestions
- Mobile app available
- Integration with TurboTax

**Pros:** User-friendly, good customer support, comprehensive exchange support
**Cons:** Can be expensive for high-volume traders, limited DeFi support

#### 2. Koinly
**Best for:** All user levels, strong DeFi support
**Pricing:** Free for portfolio tracking, $49-$399/year for tax reports
**Features:**
- Supports 350+ exchanges
- Advanced DeFi transaction handling
- Multiple accounting methods (FIFO, LIFO, etc.)
- Tax optimization suggestions
- Multi-country support

**Pros:** Excellent DeFi support, competitive pricing, good documentation
**Cons:** Interface can be overwhelming for beginners

#### 3. TaxBit
**Best for:** Professional traders and institutions
**Pricing:** Custom pricing for individuals, enterprise solutions
**Features:**
- Institutional-grade accuracy
- Advanced DeFi and NFT support
- Professional tax preparation services
- Audit defense services
- White-glove onboarding

**Pros:** Highest accuracy, professional support, audit protection
**Cons:** Expensive, overkill for casual users

#### 4. CryptoTrader.Tax
**Best for:** Budget-conscious users
**Pricing:** $50-$300/year
**Features:**
- Supports major exchanges
- Basic DeFi support
- Multiple tax forms
- Cost basis tracking
- Tax loss harvesting

**Pros:** Affordable, straightforward interface, good for simple portfolios
**Cons:** Limited advanced features, fewer exchange integrations

#### 5. Accointing (now part of Glassnode)
**Best for:** European users
**Pricing:** Free for <25 transactions, €11.90-€119/year
**Features:**
- Strong European tax law support
- Portfolio analytics
- DeFi transaction categorization
- Mobile app
- Real-time sync

**Pros:** European focus, good analytics, competitive pricing
**Cons:** Smaller user base, limited advanced features

### Manual Record-Keeping Methods:

#### Spreadsheet Tracking:
**Required columns:**
- Date and time
- Transaction type
- Crypto amount
- Fiat value
- Exchange/wallet
- Transaction ID
- Fees paid

**Template example:**
\`\`\`
Date     | Type  | Amount | Crypto | USD Value | Exchange | Fee | Notes
---------|-------|--------|--------|-----------|----------|-----|-------
01-15-24 | Buy   | 0.5    | BTC    | $21,500   | Coinbase | $25 | Initial purchase
02-01-24 | Trade | 0.1    | BTC    | $4,200    | Uniswap  | $15 | Swapped for ETH
\`\`\`

#### Blockchain Explorers:
- **Etherscan** - Ethereum transactions
- **Blockchain.info** - Bitcoin transactions
- **BscScan** - Binance Smart Chain
- **PolygonScan** - Polygon network

### Setting Up Automated Tracking:

#### Exchange API Connections:
**Steps:**
1. Create read-only API keys on exchanges
2. Connect APIs to tax software
3. Import historical transactions
4. Set up automatic syncing

**Security tips:**
- Use read-only permissions only
- Enable IP whitelisting
- Regularly rotate API keys
- Monitor for unauthorized access

#### Wallet Tracking:
**Methods:**
- **Public address tracking** - Add wallet addresses to software
- **CSV imports** - Export and import wallet transaction history
- **Blockchain scanning** - Software automatically finds transactions

### DeFi Transaction Tracking:

#### Common DeFi Challenges:
- **Complex transactions** - Multiple steps in one transaction
- **Token swaps** - Determining fair market value
- **Liquidity provision** - Tracking impermanent loss
- **Yield farming** - Categorizing reward tokens

#### Solutions:
- **Specialized tools** - Koinly, TaxBit for DeFi
- **Manual categorization** - Review and categorize transactions
- **Professional help** - Consult DeFi tax specialists

### Best Practices for Record-Keeping:

#### Daily Habits:
- **Screenshot confirmations** - Save transaction confirmations
- **Note purposes** - Record why you made each transaction
- **Track fees** - Include all transaction costs
- **Backup data** - Regular backups of tracking files

#### Monthly Reviews:
- **Reconcile balances** - Ensure tracking matches actual holdings
- **Categorize transactions** - Review and properly categorize all activity
- **Update software** - Sync new transactions
- **Check for errors** - Look for missing or incorrect data

#### Annual Preparation:
- **Final reconciliation** - Ensure all transactions are captured
- **Generate reports** - Create tax forms and summaries
- **Professional review** - Have complex situations reviewed
- **File taxes** - Submit required forms and payments

### Common Tracking Mistakes:

#### 1. Starting Too Late
**Problem:** Trying to reconstruct years of transactions
**Solution:** Start tracking immediately, even with incomplete history

#### 2. Ignoring Small Transactions
**Problem:** Not tracking small trades or DeFi interactions
**Solution:** Track everything, regardless of size

#### 3. Poor Exchange Records
**Problem:** Exchanges delete old transaction history
**Solution:** Regular exports and backups of exchange data

#### 4. Missing Wallet Transactions
**Problem:** Not tracking wallet-to-wallet transfers
**Solution:** Include all addresses in tracking software

#### 5. Inadequate Backup
**Problem:** Losing tracking data due to computer failure
**Solution:** Cloud backups and multiple copies of important data

### Free vs Paid Tools:

#### When Free Tools Work:
- **Simple portfolios** - Few exchanges, basic transactions
- **Low volume** - <25 transactions per year
- **Basic needs** - Just need simple gain/loss calculations

#### When to Upgrade:
- **High volume** - 100+ transactions per year
- **Multiple exchanges** - Using 3+ different platforms
- **DeFi activity** - Complex DeFi transactions
- **Professional trading** - Trading as business activity
- **Audit concerns** - Need professional-grade accuracy

### Integration with Tax Preparation:

#### Popular Integrations:
- **TurboTax** - Supported by most crypto tax software
- **FreeTaxUSA** - Some integration available
- **H&R Block** - Limited crypto support
- **Professional preparers** - Most can work with crypto tax reports

#### What to Provide Your Tax Preparer:
- Complete transaction history
- Gain/loss summaries
- Form 8949 if generated
- Documentation of cost basis methods
- Records of any missing or estimated data
          `,
          keyTakeaways: [
            'Crypto tax software automates complex calculations and saves time',
            'Choose software based on your transaction volume and complexity',
            'Proper API setup enables automated transaction tracking',
            'DeFi activities require specialized tracking tools',
            'Start tracking early and maintain regular backup habits'
          ],
          xpReward: 70,
          difficulty: 'medium' as const,
          tags: ['tax-software', 'record-keeping', 'automation', 'defi-tracking']
        }
      ]
    }
  ]
};
