// Modern, up-to-date Web3 courses for 2024
// Focused on real-world skills: DeFi, Degen Trading, Advanced Trading

import { Course } from './courses';

export const modernCourses: Record<string, Course> = {
  // DeFi Mastery Course - Updated for 2024
  defi: {
    id: "defi",
    title: "DeFi Mastery: Yield Farming & Liquidity Strategies",
    description: "Master DeFi protocols, yield farming, and liquidity provision with real strategies used by professionals",
    longDescription: "Learn to navigate the $100B+ DeFi ecosystem. Master yield farming, liquidity provision, and advanced DeFi strategies used by professionals to generate passive income.",
    level: "Intermediate",
    duration: "3 weeks",
    color: "bg-purple-500",
    gradient: "from-purple-400 to-purple-600",
    icon: "Target",
    category: "defi",
    difficulty: 3,
    totalXP: 1200,
    skills: ["Yield Farming", "Liquidity Provision", "DeFi Protocols", "Risk Management", "Portfolio Optimization"],
    learningOutcomes: [
      "Master major DeFi protocols (Uniswap, Aave, Compound, Curve)",
      "Implement profitable yield farming strategies",
      "Understand impermanent loss and risk management",
      "Navigate DEXs and automated market makers",
      "Build diversified DeFi portfolios"
    ],
    certification: {
      available: true,
      requirements: ["Complete all modules", "Deploy $100+ in real DeFi protocols", "Pass final assessment with 85%"],
      credentialName: "Certified DeFi Strategist"
    },
    modules: [
      {
        id: 1,
        title: "DeFi Landscape 2024",
        description: "Current state of DeFi: protocols, TVL, and opportunities",
        estimatedTime: "1 week",
        xpReward: 300,
        badge: {
          name: "DeFi Explorer",
          icon: "🏦",
          description: "Mastered the DeFi ecosystem overview"
        },
        chapters: [
          {
            id: 1,
            title: "DeFi Market Overview: $100B+ Ecosystem",
            duration: "15 min",
            difficulty: "easy",
            xpReward: 50,
            tags: ["defi", "market-analysis", "2024"],
            content: `DeFi has exploded to over $100 billion in Total Value Locked (TVL) as of 2024. Let's explore the current landscape and opportunities.

**Current DeFi Market (2024 Data):**

**Total Value Locked (TVL): $105B+**
- Ethereum: $65B (62% market share)
- Binance Smart Chain: $8B (7.6%)
- Arbitrum: $6B (5.7%)
- Polygon: $4B (3.8%)
- Avalanche: $3B (2.9%)

**Top DeFi Protocols by TVL:**

**1. Lido ($32B TVL)**
- Liquid staking for Ethereum 2.0
- Earn 4-5% APY on ETH while keeping liquidity
- stETH token represents staked ETH

**2. Aave ($11B TVL)**
- Leading lending/borrowing protocol
- Supports 15+ networks
- Flash loans and credit delegation features

**3. Uniswap ($5.2B TVL)**
- Largest decentralized exchange
- V4 launching with hooks and custom pools
- 0.05% to 1% trading fees for LPs

**4. Curve ($4.8B TVL)**
- Specialized for stablecoin trading
- Low slippage for large trades
- CRV token rewards for liquidity providers

**5. Compound ($3.1B TVL)**
- Algorithmic money markets
- Earn interest on deposits
- Borrow against collateral

**DeFi Categories & Opportunities:**

**Lending & Borrowing (35% of TVL)**
- Earn 3-8% APY on stablecoins
- Borrow against crypto collateral
- Flash loans for arbitrage

**DEXs & AMMs (25% of TVL)**
- Provide liquidity for trading fees
- Earn 0.1-2% daily from volume
- Impermanent loss risks

**Liquid Staking (30% of TVL)**
- Stake ETH while keeping liquidity
- 4-5% base staking rewards
- Additional DeFi yield opportunities

**Yield Farming (10% of TVL)**
- Combine multiple protocols
- 10-50%+ APY possible
- Higher risk, higher reward

**Real-World Example: Ethereum Staking Strategy**
1. Stake ETH on Lido → Get stETH (4.5% APY)
2. Deposit stETH on Aave → Earn additional 2% APY
3. Borrow USDC against stETH → Deploy in Curve pools
4. Total potential yield: 8-12% APY

**2024 Trends to Watch:**
- Real World Assets (RWAs) tokenization
- Liquid staking derivatives growth
- Cross-chain DeFi expansion
- Institutional DeFi adoption
- Regulatory clarity improvements`,
            keyTakeaways: [
              "DeFi has $105B+ TVL with Ethereum dominating at 62%",
              "Liquid staking (Lido) is the largest category at $32B TVL",
              "Major protocols offer 3-8% stable yields with higher risk opportunities",
              "Combining protocols can create 8-12%+ yield strategies",
              "2024 trends focus on RWAs, liquid staking, and institutional adoption"
            ],
            practicalTask: {
              title: "DeFi Protocol Research",
              description: "Analyze current yields and TVL across major DeFi protocols",
              instructions: [
                "Visit DeFiLlama.com and explore the top 10 protocols by TVL",
                "Check current APY rates on Aave, Compound, and Curve",
                "Compare staking yields on Lido vs direct Ethereum staking",
                "Screenshot and analyze one protocol's 30-day TVL chart",
                "Write a 200-word analysis of the most attractive opportunity"
              ],
              estimatedTime: "45 minutes",
              tools: ["DeFiLlama", "Protocol websites", "Spreadsheet"],
              completionCriteria: [
                "Analyzed at least 5 major protocols",
                "Documented current yield rates",
                "Identified one specific opportunity with reasoning"
              ],
              points: 25
            },
            quiz: {
              question: "What is the largest DeFi protocol by TVL in 2024?",
              options: [
                "Uniswap",
                "Aave",
                "Lido",
                "Curve"
              ],
              correctAnswer: 2,
              explanation: "Lido is the largest DeFi protocol with $32B+ TVL, primarily from Ethereum liquid staking services.",
              difficulty: "easy",
              points: 15
            }
          },
          {
            id: 2,
            title: "Yield Farming Fundamentals",
            duration: "20 min",
            difficulty: "medium",
            xpReward: 75,
            tags: ["yield-farming", "liquidity", "strategies"],
            content: `Yield farming is the practice of lending or staking crypto assets to generate high returns. Learn the strategies professionals use to maximize yields.

**What is Yield Farming?**

Yield farming involves moving crypto assets between different DeFi protocols to maximize returns. Farmers provide liquidity, lend assets, or stake tokens to earn:
- Trading fees
- Protocol tokens
- Interest payments
- Governance rewards

**Core Yield Farming Strategies:**

**1. Liquidity Provision (LP)**
Provide equal value of two tokens to DEX pools:
- Example: $1000 USDC + $1000 ETH to Uniswap
- Earn 0.3% of all trading fees
- Receive LP tokens representing your share
- Risk: Impermanent loss if prices diverge

**2. Lending & Borrowing**
Deposit assets to earn interest, borrow to leverage:
- Deposit USDC on Aave: 3-5% APY
- Borrow against ETH collateral: 2-4% APR
- Use borrowed funds for additional yield
- Risk: Liquidation if collateral drops

**3. Staking & Governance**
Stake protocol tokens for rewards:
- Stake CRV on Curve: 8-15% APY
- Vote on governance proposals
- Earn boosted rewards for long-term staking
- Risk: Token price volatility

**4. Yield Aggregation**
Use protocols that automatically optimize yields:
- Yearn Finance: Auto-compounds yields
- Convex: Maximizes Curve rewards
- Beefy: Multi-chain yield optimization
- Risk: Smart contract risk, fees

**Advanced Strategies:**

**Delta-Neutral Farming**
Eliminate price risk while farming:
1. Provide ETH-USDC liquidity on Uniswap
2. Short ETH on perpetual futures
3. Earn LP fees without ETH price exposure
4. Net result: Stable yield regardless of ETH price

**Leveraged Yield Farming**
Amplify returns using borrowed capital:
1. Deposit $10k USDC on Aave
2. Borrow $7k USDC against it
3. Deposit $17k total in high-yield farm
4. Amplify returns but increase liquidation risk

**Cross-Chain Arbitrage**
Exploit yield differences across chains:
- Ethereum: Lower yields, higher security
- Polygon: Higher yields, lower fees
- Arbitrum: Balanced yields and fees
- Bridge assets to capture rate differences

**Risk Management:**

**Impermanent Loss**
- Occurs when token prices diverge in LP pairs
- Calculate: IL = (2 * sqrt(price_ratio) / (1 + price_ratio)) - 1
- Mitigate: Choose correlated pairs (ETH/stETH)

**Smart Contract Risk**
- Protocols can have bugs or exploits
- Diversify across multiple protocols
- Check audit reports and TVL history

**Liquidation Risk**
- Borrowed positions can be liquidated
- Maintain healthy collateral ratios
- Set up monitoring and alerts

**Real Example: Curve 3Pool Strategy**
1. Deposit USDC/USDT/DAI in Curve 3Pool
2. Stake LP tokens in Curve gauge
3. Earn CRV rewards (5-10% APY)
4. Stake CRV for veCRV to boost rewards
5. Total yield: 8-15% APY on stablecoins

**Yield Farming Tools:**
- **DeFiPulse**: Track protocol yields
- **APY.vision**: Analyze LP performance
- **Zapper**: Portfolio management
- **DeBank**: Multi-chain tracking
- **Yearn**: Automated strategies`,
            keyTakeaways: [
              "Yield farming combines multiple DeFi strategies to maximize returns",
              "Core strategies include LP provision, lending/borrowing, and staking",
              "Advanced techniques like delta-neutral and leveraged farming exist",
              "Risk management is crucial: IL, smart contract, and liquidation risks",
              "Professional tools help track and optimize yield farming performance"
            ],
            practicalTask: {
              title: "Yield Farming Strategy Design",
              description: "Design a complete yield farming strategy for $10,000",
              instructions: [
                "Choose a risk level: Conservative (5-8% APY), Moderate (8-15% APY), or Aggressive (15%+ APY)",
                "Select 2-3 DeFi protocols to use",
                "Calculate expected returns and identify risks",
                "Create a step-by-step execution plan",
                "Include exit strategy and risk management"
              ],
              estimatedTime: "60 minutes",
              tools: ["DeFiLlama", "Calculator", "Protocol documentation"],
              completionCriteria: [
                "Complete strategy document with risk assessment",
                "Realistic yield calculations",
                "Clear execution steps and risk management plan"
              ],
              points: 35
            }
          }
        ]
      },
      {
        id: 2,
        title: "Advanced DeFi Strategies",
        description: "Professional yield optimization and portfolio management",
        estimatedTime: "1 week",
        xpReward: 400,
        chapters: [
          {
            id: 1,
            title: "Liquidity Provision and Impermanent Loss Management",
            duration: "35 min",
            difficulty: "hard",
            xpReward: 100,
            tags: ["liquidity", "impermanent-loss", "amm"],
            content: `Master liquidity provision strategies and learn to minimize impermanent loss while maximizing returns.

## Understanding Automated Market Makers (AMMs)

### How AMMs Work

Traditional exchanges use order books where buyers and sellers place orders. AMMs use liquidity pools where users provide tokens and algorithms determine prices.

**Constant Product Formula (Uniswap V2):**
\`x * y = k\`

Where:
- x = Amount of token A in pool
- y = Amount of token B in pool
- k = Constant product

### Example:
Pool has 100 ETH and 200,000 USDC
- k = 100 × 200,000 = 20,000,000
- Current price: 200,000 ÷ 100 = 2,000 USDC per ETH

If someone buys 10 ETH:
- New ETH amount: 90 ETH
- New USDC amount: 20,000,000 ÷ 90 = 222,222 USDC
- Price impact: User pays 22,222 USDC for 10 ETH (2,222 per ETH)

## Impermanent Loss Explained

### What is Impermanent Loss?

Impermanent loss occurs when the price ratio of tokens in a liquidity pool changes compared to when you deposited them. You would have been better off just holding the tokens.

### Mathematical Formula:

\`IL = (2 × √(price_ratio) / (1 + price_ratio)) - 1\`

### Real Examples:

**Scenario 1: ETH/USDC Pool**
- Initial: 1 ETH = $2,000, deposit 1 ETH + 2,000 USDC
- Later: 1 ETH = $4,000 (2x price increase)
- Impermanent Loss: 5.72%

**Calculation:**
- Price ratio = 4,000/2,000 = 2
- IL = (2 × √2 / (1 + 2)) - 1 = -0.0572 = -5.72%

**What this means:**
- Just holding: $4,000 + $2,000 = $6,000
- LP position: ~$5,657 (after IL)
- Loss: $343 or 5.72%

### Impermanent Loss at Different Price Changes:

| Price Change | Impermanent Loss |
|--------------|------------------|
| 1.25x        | 0.6%            |
| 1.5x         | 2.0%            |
| 2x           | 5.7%            |
| 3x           | 13.4%           |
| 4x           | 20.0%           |
| 5x           | 25.5%           |

## Strategies to Minimize Impermanent Loss

### 1. Choose Correlated Pairs

**Highly Correlated Pairs (Low IL Risk):**
- ETH/stETH (liquid staking derivative)
- USDC/USDT (both stablecoins)
- WBTC/ETH (both major cryptos)

**Example: ETH/stETH Pool**
- Both tokens track ETH price closely
- IL typically under 1% even with large ETH moves
- Earn trading fees + staking rewards

### 2. Stablecoin Pools

**3Pool (USDC/USDT/DAI) on Curve:**
- Minimal price divergence between stablecoins
- IL risk near zero
- Earn 2-5% APY from trading fees
- Additional CRV token rewards

### 3. Single-Sided Staking

**Bancor V3 (Before Sunset):**
- Provided impermanent loss protection
- Could stake single tokens
- IL protection increased over time

**Current Alternatives:**
- Tokemak: Single-sided staking with TOKE rewards
- Olympus Pro: Bond programs for single tokens

### 4. Delta-Neutral Strategies

**Strategy: LP + Short Position**

1. Provide ETH/USDC liquidity on Uniswap
2. Short ETH on perpetual futures (equal to LP exposure)
3. Earn LP fees while hedging price risk

**Example:**
- LP: $10,000 in ETH/USDC (50/50)
- Short: $5,000 worth of ETH on dYdX
- Result: Neutral to ETH price movements

## Advanced Liquidity Strategies

### 1. Concentrated Liquidity (Uniswap V3)

**How it Works:**
- Provide liquidity within specific price ranges
- Higher capital efficiency
- More fees but higher IL risk if price moves out of range

**Example Strategy:**
- ETH price: $2,000
- Set range: $1,800 - $2,200 (±10%)
- Earn 3-5x more fees than V2
- Risk: No fees if ETH goes below $1,800 or above $2,200

### 2. Range Management

**Active Management:**
- Monitor price movements
- Adjust ranges when price approaches boundaries
- Compound fees back into position

**Tools for Range Management:**
- Gamma Strategies: Automated range management
- Charm Finance: Options-based LP strategies
- Arrakis: Active liquidity management

### 3. Multi-Pool Strategies

**Diversified LP Portfolio:**
- 40% Stablecoin pools (low risk, steady returns)
- 30% Major crypto pairs (ETH/WBTC)
- 20% Correlated pairs (ETH/stETH)
- 10% High-yield experimental pools

## Yield Optimization Techniques

### 1. Fee Tier Selection

**Uniswap V3 Fee Tiers:**
- 0.05%: Stablecoin pairs
- 0.3%: Standard pairs (ETH/USDC)
- 1%: Exotic or volatile pairs

**Strategy:**
- Higher fees = more revenue per trade
- Lower fees = more trading volume
- Choose based on pair volatility and competition

### 2. Liquidity Mining Programs

**Additional Rewards:**
- Protocol tokens (UNI, SUSHI, CRV)
- Partner token incentives
- Governance token airdrops

**Example: Curve Gauge Rewards**
- Base APY: 3% from trading fees
- CRV rewards: 5-15% APY
- Boosted rewards with veCRV: Up to 2.5x multiplier
- Total APY: 15-30%+

### 3. Compounding Strategies

**Auto-Compounding Protocols:**
- Harvest Finance: Auto-compounds farm rewards
- Yearn Finance: Optimized yield strategies
- Beefy Finance: Multi-chain auto-compounding

**Manual Compounding:**
- Claim rewards weekly/monthly
- Reinvest into LP positions
- Consider gas costs vs. reward amounts

## Risk Management Framework

### 1. Position Sizing

**Conservative Approach:**
- Max 20% of portfolio in LP positions
- Diversify across multiple pools
- Focus on established protocols

**Aggressive Approach:**
- Up to 50% in LP positions
- Higher allocation to new/experimental pools
- Active management required

### 2. Due Diligence Checklist

**Protocol Assessment:**
- [ ] Smart contract audits completed
- [ ] TVL and volume trends
- [ ] Team reputation and track record
- [ ] Governance token distribution
- [ ] Insurance coverage available

**Pool Assessment:**
- [ ] Historical IL analysis
- [ ] Fee generation consistency
- [ ] Liquidity depth and stability
- [ ] Token correlation analysis
- [ ] Reward sustainability

### 3. Exit Strategies

**Profit Taking:**
- Take profits at 20-30% gains
- Rebalance portfolio quarterly
- Move to safer pools during market uncertainty

**Loss Mitigation:**
- Set IL tolerance limits (e.g., max 10% IL)
- Exit positions approaching limits
- Have backup strategies ready

## Tools and Analytics

### 1. IL Calculators
- **APY.vision**: Historical IL tracking
- **Croco Finance**: IL calculator and analytics
- **DeFiYield**: Pool performance tracking

### 2. Portfolio Management
- **Zapper**: Multi-protocol portfolio view
- **DeBank**: Cross-chain portfolio tracking
- **Zerion**: DeFi portfolio management

### 3. Analytics Platforms
- **Dune Analytics**: Custom LP performance queries
- **The Graph**: On-chain data indexing
- **DeFiPulse**: Protocol TVL and metrics

## Real-World Case Studies

### Case Study 1: ETH/USDC LP During Bull Market

**Setup:**
- Date: January 2023
- Initial: $10,000 (2.5 ETH + 5,000 USDC)
- ETH Price: $2,000

**Outcome (6 months later):**
- ETH Price: $3,000 (+50%)
- LP Value: $12,247
- Just Holding: $12,500
- IL: $253 (2.02%)
- Fees Earned: $847
- Net Profit: $594 vs. holding

**Lessons:**
- Fees can offset moderate IL
- Bull markets increase IL risk
- Regular rebalancing helps

### Case Study 2: Stablecoin Pool Strategy

**Setup:**
- Pool: Curve 3Pool (USDC/USDT/DAI)
- Amount: $50,000
- Duration: 12 months

**Results:**
- Base APY: 3.2% ($1,600)
- CRV Rewards: 8.1% ($4,050)
- IL: Near zero
- Total Return: 11.3% ($5,650)

**Lessons:**
- Stablecoin pools offer predictable returns
- Governance tokens provide significant upside
- Lower risk but still attractive yields`,
            keyTakeaways: [
              "Impermanent loss is the opportunity cost of providing liquidity vs. holding tokens",
              "Correlated pairs and stablecoin pools minimize IL risk",
              "Concentrated liquidity offers higher returns but requires active management",
              "Fee earnings can offset impermanent loss in many scenarios",
              "Risk management and diversification are crucial for sustainable LP strategies"
            ],
            practicalTask: {
              title: "LP Strategy Optimization",
              description: "Design and backtest a liquidity provision strategy",
              instructions: [
                "Choose 3 different liquidity pools (stablecoin, major pair, exotic)",
                "Calculate historical impermanent loss for each over the last 6 months",
                "Estimate fee earnings using pool volume data",
                "Design a $25,000 portfolio allocation across the pools",
                "Create a risk management plan with entry/exit criteria",
                "Present your strategy with expected returns and risks"
              ],
              estimatedTime: "2 hours",
              tools: ["APY.vision", "DeFiLlama", "Uniswap Analytics", "Excel/Sheets"],
              completionCriteria: [
                "Analyzed 3 different pool types",
                "Calculated historical IL and fees accurately",
                "Created realistic portfolio allocation",
                "Developed comprehensive risk management plan"
              ],
              points: 100
            }
          }
        ]
      },
      {
        id: 3,
        title: "DeFi Protocol Deep Dives",
        description: "Master specific protocols: Uniswap, Aave, Curve, and emerging platforms",
        estimatedTime: "1 week",
        xpReward: 500,
        chapters: [
          {
            id: 1,
            title: "Uniswap V3: Advanced Features and Strategies",
            duration: "40 min",
            difficulty: "hard",
            xpReward: 125,
            tags: ["uniswap", "concentrated-liquidity", "defi"],
            content: `Master Uniswap V3's revolutionary concentrated liquidity and advanced trading features.

## Uniswap V3 Revolution

### Key Innovations

**1. Concentrated Liquidity**
- Provide liquidity within specific price ranges
- Capital efficiency up to 4000x compared to V2
- Higher fees but increased complexity

**2. Multiple Fee Tiers**
- 0.05% for stablecoin pairs
- 0.3% for standard pairs
- 1% for exotic pairs

**3. Non-Fungible Liquidity**
- Each position is unique (NFT)
- Customizable price ranges
- Active management required

### How Concentrated Liquidity Works

**Traditional AMM (V2):**
- Liquidity spread across entire price curve (0 to ∞)
- Most liquidity never used
- Lower capital efficiency

**Concentrated Liquidity (V3):**
- Liquidity concentrated in specific ranges
- Higher utilization of capital
- More fees per dollar deposited

### Mathematical Foundation

**Price Range Formula:**
\`Price = 1.0001^tick\`

**Tick Spacing:**
- 0.05% fee: 10 tick spacing
- 0.3% fee: 60 tick spacing
- 1% fee: 200 tick spacing

**Liquidity Calculation:**
\`L = √(x × y)\`

Where x and y are token amounts in the active range.

## Advanced V3 Strategies

### 1. Range Trading Strategy

**Concept:**
Set tight ranges around current price to maximize fee capture.

**Example: ETH/USDC Range Trading**
- Current ETH price: $2,000
- Set range: $1,950 - $2,050 (±2.5%)
- Capture maximum fees from price oscillations
- Rebalance when price exits range

**Pros:**
- Very high fee APY (often 50-200%+)
- Quick profit realization

**Cons:**
- High maintenance required
- Gas costs for frequent rebalancing
- Risk of missing major moves

### 2. Wide Range Strategy

**Concept:**
Set wide ranges to minimize management while still improving capital efficiency.

**Example: ETH/USDC Wide Range**
- Current ETH price: $2,000
- Set range: $1,200 - $3,500 (±40%)
- Lower maintenance
- Still 2-3x more efficient than V2

**Pros:**
- Lower maintenance
- Captures major price movements
- Reduced gas costs

**Cons:**
- Lower fee concentration
- Still subject to impermanent loss

### 3. Asymmetric Ranges

**Concept:**
Set ranges that favor one direction based on market outlook.

**Bullish Example:**
- Current ETH price: $2,000
- Set range: $1,900 - $2,800 (wider upside)
- Benefit from upward price movement
- Reduced downside exposure

### 4. Multi-Range Strategy

**Concept:**
Deploy multiple positions with different ranges.

**Example Setup:**
- Position 1: $1,950 - $2,050 (tight, 30% allocation)
- Position 2: $1,700 - $2,300 (medium, 50% allocation)
- Position 3: $1,200 - $3,000 (wide, 20% allocation)

**Benefits:**
- Diversified risk exposure
- Balanced fee capture
- Reduced management burden

## V3 Position Management

### 1. Range Monitoring

**Key Metrics to Track:**
- Current price vs. range boundaries
- Fee accumulation rate
- Impermanent loss progression
- Gas costs for rebalancing

**Tools:**
- Uniswap Analytics
- Revert Finance
- DefiEdge
- Gamma Strategies

### 2. Rebalancing Triggers

**Price-Based Triggers:**
- Rebalance when price hits 80% of range boundary
- Emergency exit if price breaks range significantly

**Time-Based Triggers:**
- Weekly rebalancing regardless of price
- Monthly strategy review and adjustment

**Fee-Based Triggers:**
- Rebalance when accumulated fees exceed gas costs
- Compound fees into larger positions

### 3. Gas Optimization

**Batch Operations:**
- Combine multiple actions in single transaction
- Use multicall functions when available

**Timing:**
- Rebalance during low gas periods
- Consider Layer 2 deployments (Arbitrum, Polygon)

**Threshold Management:**
- Set minimum fee thresholds for rebalancing
- Account for gas costs in profitability calculations

## Advanced V3 Features

### 1. Flash Swaps

**Concept:**
Borrow tokens from Uniswap pools without collateral, execute arbitrage, and repay in same transaction.

**Use Cases:**
- Arbitrage between exchanges
- Liquidation assistance
- Complex DeFi strategies

**Example Code:**
\`\`\`solidity
contract FlashSwapExample {
    function initiateFlashSwap(
        address pool,
        uint256 amount0,
        uint256 amount1
    ) external {
        IUniswapV3Pool(pool).flash(
            address(this),
            amount0,
            amount1,
            abi.encode(msg.sender)
        );
    }

    function uniswapV3FlashCallback(
        uint256 fee0,
        uint256 fee1,
        bytes calldata data
    ) external {
        // Arbitrage logic here
        // Must repay borrowed amount + fees
    }
}
\`\`\`

### 2. TWAP Oracles

**Time-Weighted Average Price:**
- Built-in price oracles
- Manipulation resistant
- Used by other protocols

**Implementation:**
\`\`\`solidity
function getTWAP(address pool, uint32 secondsAgo)
    external view returns (int24 tick) {
    uint32[] memory secondsAgos = new uint32[](2);
    secondsAgos[0] = secondsAgo;
    secondsAgos[1] = 0;

    (int56[] memory tickCumulatives,) =
        IUniswapV3Pool(pool).observe(secondsAgos);

    tick = int24((tickCumulatives[1] - tickCumulatives[0]) / secondsAgo);
}
\`\`\`

### 3. Limit Orders

**Concept:**
Use concentrated liquidity to create limit order functionality.

**How it Works:**
- Set range entirely above (sell order) or below (buy order) current price
- When price enters range, swap occurs automatically
- Collect proceeds when price exits range

**Example: ETH Sell Order**
- Current ETH price: $2,000
- Want to sell at $2,200
- Set range: $2,200 - $2,250
- Deposit ETH, receive USDC when price hits range

## V3 Analytics and Performance

### 1. Key Performance Metrics

**Fee APR:**
\`Fee APR = (Fees Earned / Liquidity Provided) × (365 / Days)\`

**Impermanent Loss:**
\`IL = (LP Value / Hold Value) - 1\`

**Total Return:**
\`Total Return = Fee APR + IL\`

### 2. Backtesting Strategies

**Historical Analysis:**
- Download historical price data
- Simulate different range strategies
- Calculate fees and IL for each approach
- Optimize parameters

**Tools:**
- Flipside Crypto
- Dune Analytics
- Custom Python scripts
- Revert Finance simulator

### 3. Risk Metrics

**Value at Risk (VaR):**
- Maximum expected loss over time period
- 95% confidence interval typically used

**Maximum Drawdown:**
- Largest peak-to-trough decline
- Measures worst-case scenario

**Sharpe Ratio:**
- Risk-adjusted returns
- (Return - Risk-free Rate) / Volatility

## Layer 2 Considerations

### 1. Arbitrum Deployment

**Advantages:**
- Lower gas costs (90%+ reduction)
- Faster transaction finality
- Same V3 functionality

**Considerations:**
- Lower liquidity than mainnet
- Bridge costs and delays
- Different yield opportunities

### 2. Polygon Deployment

**Advantages:**
- Very low gas costs
- Fast transactions
- Growing ecosystem

**Considerations:**
- Different security model
- MATIC token dependency
- Bridge risks

### 3. Cross-Chain Strategies

**Multi-Chain LP:**
- Deploy on multiple chains
- Arbitrage between chains
- Diversify execution risk

**Chain Selection Criteria:**
- Gas costs vs. volume
- Security and decentralization
- Ecosystem maturity
- Bridge reliability

## Future V3 Developments

### 1. V4 Preview

**Hooks System:**
- Custom logic for pools
- Dynamic fees
- Advanced order types

**Singleton Architecture:**
- All pools in one contract
- Reduced gas costs
- Better composability

### 2. Integration Opportunities

**Yield Aggregators:**
- Automated V3 management
- Cross-protocol strategies
- Institutional adoption

**Options Protocols:**
- LP positions as collateral
- Hedging strategies
- Enhanced returns`,
            keyTakeaways: [
              "Concentrated liquidity provides up to 4000x capital efficiency vs V2",
              "Active management is required but can generate significantly higher returns",
              "Multiple strategies exist from tight range trading to wide passive ranges",
              "Gas costs must be factored into rebalancing decisions",
              "V3 enables advanced features like limit orders and improved oracles"
            ],
            practicalTask: {
              title: "V3 Position Optimization",
              description: "Create and manage a Uniswap V3 position with optimal range selection",
              instructions: [
                "Choose an ETH/USDC or ETH/USDT pair on Uniswap V3",
                "Analyze 30-day price history to determine optimal range",
                "Calculate expected fees based on historical volume",
                "Create a position on testnet or with small amounts",
                "Monitor for 1 week and document performance",
                "Create a rebalancing strategy with specific triggers"
              ],
              estimatedTime: "3 hours + 1 week monitoring",
              tools: ["Uniswap V3", "Uniswap Analytics", "Revert Finance", "DeFiLlama"],
              completionCriteria: [
                "Successfully created V3 position",
                "Documented range selection rationale",
                "Tracked performance metrics",
                "Developed rebalancing strategy"
              ],
              points: 125
            }
          }
        ]
      }
    ]
  },

  // Degen Trading Course - High-Risk, High-Reward Strategies
  degen: {
    id: "degen",
    title: "Degen Trading: Memecoins, Leverage & Airdrops",
    description: "Master high-risk, high-reward crypto strategies: memecoin trading, leverage, and airdrop farming",
    longDescription: "Learn the art of degen trading - from memecoin analysis to leverage trading and airdrop farming. High-risk strategies that can generate massive returns.",
    level: "Advanced",
    duration: "2 weeks",
    color: "bg-orange-500",
    gradient: "from-orange-400 to-red-500",
    icon: "TrendingUp",
    category: "trading",
    difficulty: 4,
    totalXP: 800,
    skills: ["Memecoin Analysis", "Leverage Trading", "Airdrop Farming", "Risk Management", "Social Sentiment"],
    learningOutcomes: [
      "Identify promising memecoins before they pump",
      "Use leverage safely for amplified returns",
      "Farm airdrops from new protocols",
      "Manage extreme risk in high-volatility trades",
      "Read social sentiment and market psychology"
    ],
    certification: {
      available: true,
      requirements: ["Complete all modules", "Execute 5 successful degen trades", "Pass risk management assessment"],
      credentialName: "Certified Degen Trader"
    },
    modules: [
      {
        id: 1,
        title: "Memecoin Mastery",
        description: "How to identify and trade memecoins for massive gains",
        estimatedTime: "1 week",
        xpReward: 400,
        chapters: [
          {
            id: 1,
            title: "Memecoin Analysis: Finding the Next 100x",
            duration: "25 min",
            difficulty: "hard",
            xpReward: 100,
            tags: ["memecoins", "analysis", "social-sentiment"],
            content: `Memecoins can deliver 100x+ returns but are extremely risky. Learn how to analyze and trade them like a pro.

**Memecoin Market Overview 2024:**

**Success Stories:**
- DOGE: $0.0002 → $0.70 (350,000% gain)
- SHIB: $0.000000001 → $0.000088 (8,800,000% gain)  
- PEPE: $0.000000001 → $0.000004 (400,000% gain in 2023)
- BONK: $0.0000001 → $0.00003 (30,000% gain in 2023)

**Memecoin Analysis Framework:**

**1. Social Sentiment Analysis**
- Twitter mentions and engagement
- Telegram/Discord community size
- Reddit discussions and upvotes
- TikTok and YouTube coverage

**2. Technical Indicators**
- Market cap under $10M for early entry
- Low circulating supply (under 1T tokens)
- Liquidity pool size and lock duration
- Holder distribution (avoid whale concentration)

**3. Fundamental Factors**
- Strong meme potential and virality
- Active development team
- Clear roadmap and utility plans
- Celebrity or influencer endorsements

**4. Risk Assessment**
- Contract audit status
- Liquidity lock duration
- Team token allocation
- Rug pull indicators

**Memecoin Trading Strategies:**

**Strategy 1: Early Bird (Highest Risk/Reward)**
- Buy within first 24 hours of launch
- Target: 10-100x returns
- Risk: 90%+ chance of total loss
- Position size: 1-2% of portfolio max

**Strategy 2: Momentum Riding**
- Enter after initial pump confirmation
- Target: 2-10x returns  
- Risk: 70% chance of loss
- Position size: 2-5% of portfolio

**Strategy 3: Established Meme**
- Trade established memecoins during cycles
- Target: 50-200% returns
- Risk: 40% chance of loss
- Position size: 5-10% of portfolio

**Tools for Memecoin Research:**

**On-Chain Analysis:**
- Etherscan/BSCScan: Contract verification
- DexTools: Real-time charts and metrics
- PooCoin: BSC memecoin tracker
- Dex Screener: Multi-chain DEX data

**Social Sentiment:**
- LunarCrush: Social media analytics
- CoinGecko trending: Popular coins
- Twitter: Real-time sentiment
- Reddit: Community discussions

**Safety Tools:**
- Token Sniffer: Rug pull detection
- Honeypot.is: Contract safety check
- RugDoc: Project reviews
- CertiK: Security audits

**Red Flags to Avoid:**
- Anonymous team with no doxxing
- Locked liquidity under 6 months
- High team token allocation (>20%)
- No audit or failed audit
- Suspicious contract functions
- Fake social media followers

**Case Study: PEPE 2023 Success**

**Pre-Launch Indicators:**
- Strong meme recognition (Pepe the Frog)
- Fair launch with no team allocation
- Liquidity locked for 1 year
- Active community building

**Entry Strategy:**
- Bought at $0.000000001 market cap
- Initial investment: $1,000
- Peak value: $400,000 (400x return)
- Exit strategy: Sold 50% at 100x, 25% at 200x

**Risk Management Rules:**

**Position Sizing:**
- Never risk more than 10% total portfolio
- Individual memecoin max: 2-5%
- Use "fun money" only

**Exit Strategy:**
- Take profits at 2x, 5x, 10x milestones
- Never hold through major resistance
- Set stop losses at -50% to -80%

**Emotional Control:**
- Accept that 80%+ trades will lose money
- Focus on risk-adjusted returns
- Don't FOMO into pumps
- Stay disciplined with position sizes`,
            keyTakeaways: [
              "Memecoins can deliver 100x+ returns but have 80%+ failure rates",
              "Success requires social sentiment analysis and technical screening",
              "Position sizing is critical - never risk more than 2-5% per trade",
              "Early entry offers highest rewards but requires extreme risk tolerance",
              "Professional tools and safety checks are essential for survival"
            ],
            practicalTask: {
              title: "Memecoin Analysis Report",
              description: "Analyze a current memecoin using professional frameworks",
              instructions: [
                "Find a memecoin launched in the last 30 days",
                "Complete social sentiment analysis using LunarCrush or similar",
                "Check contract safety using Token Sniffer and Honeypot.is",
                "Analyze holder distribution and liquidity metrics",
                "Write a 300-word investment thesis with risk assessment"
              ],
              estimatedTime: "90 minutes",
              tools: ["DexTools", "LunarCrush", "Token Sniffer", "Etherscan"],
              completionCriteria: [
                "Complete analysis using all 4 frameworks",
                "Clear buy/sell recommendation with reasoning",
                "Risk assessment and position sizing recommendation"
              ],
              points: 50
            }
          }
        ]
      },
      {
        id: 2,
        title: "Leverage Trading and Risk Management",
        description: "Master high-leverage trading while managing extreme risks",
        estimatedTime: "4 days",
        xpReward: 200,
        chapters: [
          {
            id: 1,
            title: "Leverage Trading Fundamentals",
            duration: "30 min",
            difficulty: "hard",
            xpReward: 75,
            tags: ["leverage", "futures", "risk-management"],
            content: `Master leverage trading to amplify returns while understanding and managing the extreme risks involved.

## Understanding Leverage

### What is Leverage?

Leverage allows you to control a larger position than your account balance by borrowing funds. It amplifies both profits and losses.

**Example:**
- Account balance: $1,000
- 10x leverage: Control $10,000 position
- If price moves 5% in your favor: $500 profit (50% return)
- If price moves 5% against you: $500 loss (50% loss)

### Types of Leverage Trading

**1. Margin Trading**
- Borrow funds from exchange
- Pay interest on borrowed amount
- Can be liquidated if losses exceed margin

**2. Futures Contracts**
- Standardized contracts for future delivery
- No actual borrowing
- Settled in cash

**3. Perpetual Futures**
- Futures without expiration date
- Funding rate mechanism
- Most popular for crypto leverage

**4. Options**
- Right but not obligation to buy/sell
- Limited downside (premium paid)
- Unlimited upside potential

## Leverage Platforms Comparison

### Centralized Exchanges

**Binance Futures:**
- Max leverage: 125x
- Funding rate: Every 8 hours
- Deep liquidity
- Advanced order types

**FTX (Historical - Now Bankrupt):**
- Was popular for leverage trading
- Lesson: Counterparty risk is real
- Always use reputable exchanges

**Bybit:**
- Max leverage: 100x
- Good for beginners
- Copy trading features
- Strong mobile app

### Decentralized Platforms

**dYdX:**
- Decentralized perpetuals
- Up to 20x leverage
- No KYC required
- Layer 2 (StarkEx)

**GMX:**
- Up to 30x leverage
- Zero slippage
- Multi-asset collateral
- Arbitrum and Avalanche

**Gains Network:**
- Up to 150x leverage
- Synthetic assets
- Polygon-based
- Unique GNS token model

## Leverage Trading Strategies

### 1. Trend Following with Leverage

**Strategy:**
- Identify strong trends using technical analysis
- Enter positions in trend direction
- Use 3-5x leverage to amplify returns
- Set strict stop losses

**Example: Bitcoin Bull Market**
- BTC breaks above $50,000 resistance
- Enter long position with 5x leverage
- Stop loss at $48,000 (4% risk)
- Target: $60,000 (20% gain = 100% return with leverage)

### 2. Range Trading

**Strategy:**
- Trade within established support/resistance ranges
- Use moderate leverage (2-3x)
- Quick in and out trades
- High win rate but small profits

**Example: ETH Range**
- ETH trading between $1,800-$2,200
- Long at $1,820 with 3x leverage
- Short at $2,180 with 3x leverage
- Target 5-10% moves for 15-30% returns

### 3. News-Based Trading

**Strategy:**
- Trade major news events with high leverage
- Very short-term positions (minutes to hours)
- High risk, high reward
- Requires fast execution

**Example: Fed Rate Decision**
- Fed announces rate cut
- Immediately long risk assets with 10x leverage
- Exit within 1-2 hours
- Target 2-5% moves for 20-50% returns

### 4. Arbitrage with Leverage

**Strategy:**
- Find price differences between exchanges
- Use leverage to amplify small spreads
- Lower risk but requires speed and capital

**Example: Funding Rate Arbitrage**
- Long on exchange with negative funding
- Short on exchange with positive funding
- Collect funding payments
- Delta neutral position

## Risk Management for Leverage Trading

### 1. Position Sizing

**Kelly Criterion for Leverage:**
\`f = (bp - q) / b\`

Where:
- f = Fraction of capital to risk
- b = Odds received (reward/risk ratio)
- p = Probability of winning
- q = Probability of losing (1-p)

**Practical Application:**
- Win rate: 60%
- Average win: 10%
- Average loss: 5%
- Kelly suggests: 10% of capital per trade

**Conservative Approach:**
- Use 25-50% of Kelly suggestion
- Never risk more than 2-5% per trade
- Account for leverage multiplier

### 2. Stop Loss Strategies

**Percentage-Based Stops:**
- Set stop at fixed percentage from entry
- Example: 2% stop with 10x leverage = 20% account risk

**Technical Stops:**
- Place stops below support/above resistance
- More logical but variable risk
- Adjust position size accordingly

**Time-Based Stops:**
- Exit if trade doesn't work within timeframe
- Prevents holding losing positions too long
- Good for news-based trades

### 3. Liquidation Management

**Understanding Liquidation:**
- Occurs when losses approach margin requirements
- Exchange closes position to prevent negative balance
- Usually happens at 80-90% loss of margin

**Liquidation Price Calculation:**
\`Liquidation Price = Entry Price × (1 ± (1 / Leverage))\`

**Example:**
- Long BTC at $50,000 with 10x leverage
- Liquidation price: $50,000 × (1 - 0.1) = $45,000
- 10% move against you = total loss

**Prevention Strategies:**
- Never use maximum leverage
- Add margin before liquidation
- Use lower leverage for volatile assets
- Set stops well above liquidation price

## Advanced Leverage Techniques

### 1. Pyramiding

**Concept:**
Add to winning positions as they move in your favor.

**Example:**
- Initial: Long 1 BTC at $50,000 (5x leverage)
- BTC rises to $52,000: Add 0.5 BTC
- BTC rises to $54,000: Add 0.25 BTC
- Total position: 1.75 BTC with average entry ~$51,000

**Rules:**
- Only add to winners
- Reduce size of each addition
- Move stop loss up with each addition
- Take profits at predetermined levels

### 2. Hedging

**Concept:**
Use opposing positions to reduce risk.

**Example: Long Spot, Short Futures**
- Own 10 ETH in spot wallet
- Short 10 ETH perpetual futures
- Profit from funding rates
- Delta neutral to price movements

### 3. Cross-Margin vs. Isolated Margin

**Cross-Margin:**
- Uses entire account balance as collateral
- Lower liquidation risk
- Losses can affect other positions

**Isolated Margin:**
- Each position has separate margin
- Limited loss per position
- Higher liquidation risk per position

**Best Practice:**
- Use isolated margin for high-risk trades
- Use cross-margin for lower-risk strategies
- Never risk entire account on one trade

## Psychological Aspects of Leverage Trading

### 1. Emotional Control

**Common Emotions:**
- **Greed**: Using too much leverage
- **Fear**: Closing winners too early
- **Hope**: Holding losers too long
- **Revenge**: Increasing size after losses

**Management Techniques:**
- Pre-define position sizes
- Use mechanical stop losses
- Take regular breaks
- Keep detailed trading journal

### 2. Addiction Prevention

**Warning Signs:**
- Trading with money you can't afford to lose
- Increasing leverage after losses
- Neglecting other responsibilities
- Emotional highs and lows from trading

**Prevention:**
- Set daily/weekly loss limits
- Use separate "gambling" account
- Seek help if needed
- Focus on process, not profits

### 3. Discipline and Consistency

**Key Principles:**
- Stick to predetermined plan
- Don't change rules mid-trade
- Accept losses as part of the game
- Focus on long-term profitability

## Leverage Trading Tools

### 1. Risk Calculators

**Position Size Calculator:**
- Input: Account size, risk %, stop distance
- Output: Optimal position size

**Liquidation Calculator:**
- Input: Entry price, leverage, margin
- Output: Liquidation price

### 2. Trading Platforms

**TradingView:**
- Advanced charting
- Strategy backtesting
- Social trading ideas
- Alert system

**3Commas:**
- Automated trading bots
- Portfolio management
- Copy trading
- Risk management tools

### 3. Analytics Tools

**Coinalyze:**
- Funding rates across exchanges
- Open interest data
- Liquidation levels
- Market sentiment

**Glassnode:**
- On-chain metrics
- Derivatives data
- Market indicators
- Professional analytics

## Real-World Case Studies

### Case Study 1: Successful Leverage Trade

**Setup:**
- Asset: Solana (SOL)
- Entry: $20 (after major support hold)
- Leverage: 5x
- Position size: $2,000 (10% of $20,000 account)
- Stop loss: $18 (10% stop, 50% account risk with leverage)

**Outcome:**
- SOL rallied to $35 (75% gain)
- Leverage return: 375%
- Account gain: $7,500 (37.5% of total account)
- Closed 50% at $30, 50% at $35

**Lessons:**
- Proper position sizing limited risk
- Strong technical setup
- Took profits in stages
- Managed risk throughout

### Case Study 2: Failed Leverage Trade

**Setup:**
- Asset: Bitcoin (BTC)
- Entry: $60,000 (FOMO into breakout)
- Leverage: 20x
- Position size: $10,000 (50% of account)
- No stop loss set

**Outcome:**
- BTC dropped to $45,000 (-25%)
- Liquidated at $57,000 (-5% move)
- Total loss: $10,000 (50% of account)

**Lessons:**
- Too much leverage
- No risk management
- FOMO entry
- Position size too large

## Leverage Trading Checklist

### Before Each Trade:
- [ ] Technical analysis complete
- [ ] Risk/reward ratio calculated (min 1:2)
- [ ] Position size determined
- [ ] Stop loss level set
- [ ] Take profit targets identified
- [ ] Liquidation price calculated
- [ ] Market conditions assessed
- [ ] News calendar checked

### During Trade:
- [ ] Monitor position regularly
- [ ] Stick to predetermined plan
- [ ] Adjust stops if needed
- [ ] Take partial profits at targets
- [ ] Avoid emotional decisions

### After Trade:
- [ ] Record trade details
- [ ] Analyze what worked/didn't work
- [ ] Update strategy if needed
- [ ] Calculate performance metrics
- [ ] Plan next trade`,
            keyTakeaways: [
              "Leverage amplifies both profits and losses - risk management is crucial",
              "Never risk more than 2-5% of account per trade, even with leverage",
              "Liquidation occurs when losses approach margin requirements",
              "Emotional control and discipline are more important than technical analysis",
              "Use proper position sizing formulas and always set stop losses"
            ],
            practicalTask: {
              title: "Leverage Trading Simulation",
              description: "Execute a complete leverage trading strategy with risk management",
              instructions: [
                "Choose a cryptocurrency and analyze its chart for entry opportunity",
                "Calculate optimal position size using 2% account risk",
                "Determine leverage amount (max 10x for this exercise)",
                "Set stop loss and take profit levels with 1:3 risk/reward minimum",
                "Execute trade on demo account or trading simulator",
                "Monitor trade for 48 hours and document all decisions",
                "Write post-trade analysis with lessons learned"
              ],
              estimatedTime: "3 hours + 48 hour monitoring",
              tools: ["TradingView", "Binance Testnet", "Position calculator", "Trading journal"],
              completionCriteria: [
                "Proper risk management applied",
                "Trade executed according to plan",
                "Detailed documentation of process",
                "Post-trade analysis completed"
              ],
              points: 75
            }
          }
        ]
      },
      {
        id: 3,
        title: "Airdrop Farming and Alpha Strategies",
        description: "Master the art of earning free tokens through strategic protocol interaction",
        estimatedTime: "3 days",
        xpReward: 200,
        chapters: [
          {
            id: 1,
            title: "Airdrop Farming Fundamentals",
            duration: "35 min",
            difficulty: "medium",
            xpReward: 100,
            tags: ["airdrops", "farming", "alpha"],
            content: `Learn to identify and farm potential airdrops for massive returns with minimal risk.

## What are Airdrops?

### Definition
Airdrops are free token distributions to users who meet certain criteria, typically to reward early adopters or incentivize protocol usage.

### Historical Success Stories

**Uniswap (UNI) - September 2020:**
- Criteria: Used Uniswap before September 1, 2020
- Reward: 400 UNI tokens per eligible address
- Value at launch: ~$1,200
- Peak value: ~$17,000 (42x return)

**Ethereum Name Service (ENS) - November 2021:**
- Criteria: Registered .eth domain before October 31, 2021
- Reward: Variable based on account age and activity
- Average reward: ~$10,000
- Some users received $100,000+

**Arbitrum (ARB) - March 2023:**
- Criteria: Bridged to Arbitrum and used protocols
- Reward: 625-10,250 ARB tokens
- Value at launch: $1,875-$30,750
- Total airdrop value: $1.2 billion

**Optimism (OP) - May 2022:**
- Criteria: Early Optimism users and governance participants
- Reward: Variable based on activity
- Average reward: ~$2,000
- Multiple rounds planned

## Airdrop Farming Strategy Framework

### 1. Protocol Research and Selection

**Criteria for Potential Airdrops:**
- **No token yet**: Protocol hasn't launched governance token
- **VC funding**: Well-funded projects more likely to airdrop
- **Active development**: Regular updates and improvements
- **Community hints**: Team mentions of future tokenomics
- **Governance needs**: Protocols that would benefit from decentralization

**Red Flags:**
- Team explicitly states "no token planned"
- Already has governance token
- Centralized business model
- No clear value accrual mechanism

### 2. Qualification Strategies

**Volume-Based Criteria:**
- Trade minimum amounts regularly
- Spread activity over multiple months
- Use different transaction sizes
- Avoid obvious farming patterns

**Diversity Criteria:**
- Use multiple protocols in ecosystem
- Interact with different features
- Bridge between different chains
- Participate in governance/voting

**Loyalty Criteria:**
- Early adoption (first 1000-10000 users)
- Consistent usage over time
- Large transaction volumes
- Long-term liquidity provision

### 3. Cost-Benefit Analysis

**Costs to Consider:**
- Gas fees for transactions
- Opportunity cost of capital
- Time investment
- Bridge fees for L2s

**Expected Value Calculation:**
\`EV = (Probability of Airdrop × Expected Airdrop Value) - Total Costs\`

**Example:**
- Protocol: Hypothetical DEX
- Airdrop probability: 70%
- Expected value: $3,000
- Farming costs: $200
- EV = (0.7 × $3,000) - $200 = $1,900

## Current Airdrop Opportunities (2024)

### Layer 2 Protocols

**zkSync Era:**
- **Status**: Mainnet live, no token yet
- **Strategy**: Bridge funds, use native DEXs, provide liquidity
- **Cost**: ~$50-100 in fees
- **Potential**: High (major L2 with significant funding)

**Starknet:**
- **Status**: Mainnet live, token launched but more rounds expected
- **Strategy**: Use dApps, provide liquidity, participate in governance
- **Cost**: Very low fees
- **Potential**: Medium (additional rounds likely)

**Scroll:**
- **Status**: Recently launched mainnet
- **Strategy**: Bridge early, use ecosystem dApps
- **Cost**: ~$30-50 in fees
- **Potential**: High (new L2 with strong backing)

### DeFi Protocols

**Blast:**
- **Status**: L2 with native yield, token launched
- **Strategy**: Bridge ETH/USDB, use ecosystem protocols
- **Cost**: Bridge fees + gas
- **Potential**: Medium (ecosystem still developing)

**Pendle:**
- **Status**: Has token but potential for additional rewards
- **Strategy**: Provide liquidity, use yield trading features
- **Cost**: Gas fees
- **Potential**: Low-Medium (established protocol)

### Infrastructure Projects

**EigenLayer:**
- **Status**: Restaking protocol, no token yet
- **Strategy**: Restake ETH, use AVS services when available
- **Cost**: Gas fees + opportunity cost
- **Potential**: Very High (major innovation in staking)

**Celestia:**
- **Status**: Modular blockchain, token launched
- **Strategy**: Run validator, use rollups
- **Cost**: Hardware + staking
- **Potential**: Low (token already launched)

## Advanced Airdrop Strategies

### 1. Multi-Wallet Strategy

**Concept:**
Use multiple wallets to increase chances and potential rewards.

**Implementation:**
- Create 5-20 separate wallets
- Fund each with different amounts
- Use different interaction patterns
- Avoid obvious connections between wallets

**Best Practices:**
- Use different funding sources
- Vary transaction timing
- Different geographic locations (VPN)
- Unique interaction patterns per wallet

### 2. Ecosystem Farming

**Concept:**
Farm entire ecosystems rather than individual protocols.

**Example: Arbitrum Ecosystem (Historical)**
- Bridge to Arbitrum
- Use Uniswap V3 on Arbitrum
- Provide liquidity on Balancer
- Trade on GMX
- Use Radiant Capital
- Participate in governance

**Result:**
- Arbitrum airdrop: $2,000-$30,000
- Potential future airdrops from ecosystem protocols
- Diversified exposure to multiple opportunities

### 3. Cross-Chain Farming

**Concept:**
Farm protocols across multiple blockchains.

**Strategy:**
- Identify multi-chain protocols
- Use protocol on each supported chain
- Bridge between chains using protocol's bridge
- Maintain activity on all chains

**Example: LayerZero Ecosystem**
- Use Stargate for bridging
- Trade on protocols using LayerZero
- Provide liquidity across chains
- Use omnichain NFTs

### 4. Governance Participation

**Concept:**
Actively participate in protocol governance to demonstrate commitment.

**Activities:**
- Vote on proposals
- Create governance proposals
- Participate in forum discussions
- Delegate voting power strategically

**Benefits:**
- Higher airdrop allocations
- Additional governance token rewards
- Network building opportunities
- Deep protocol understanding

## Risk Management in Airdrop Farming

### 1. Capital Allocation

**Conservative Approach:**
- Allocate 5-10% of portfolio to airdrop farming
- Focus on high-probability opportunities
- Minimize gas costs and fees

**Aggressive Approach:**
- Allocate 20-30% of portfolio
- Farm multiple opportunities simultaneously
- Accept higher costs for broader exposure

### 2. Diversification

**Protocol Diversification:**
- Farm 10-20 different protocols
- Spread across different categories (DEX, lending, L2)
- Balance high and low probability opportunities

**Chain Diversification:**
- Farm on multiple blockchains
- Include both L1s and L2s
- Consider emerging ecosystems

### 3. Time Management

**Efficient Farming:**
- Batch transactions to save gas
- Use automation tools where possible
- Focus on high-impact activities
- Set up monitoring and alerts

## Tools and Resources

### 1. Research Tools

**DefiLlama:**
- Track protocol TVL and growth
- Identify new protocols
- Monitor ecosystem development

**Token Terminal:**
- Analyze protocol fundamentals
- Revenue and user metrics
- Compare similar protocols

**Messari:**
- In-depth protocol research
- Tokenomics analysis
- Market intelligence

### 2. Tracking Tools

**DeBank:**
- Portfolio tracking across chains
- Transaction history
- Protocol interaction tracking

**Zapper:**
- Multi-protocol portfolio view
- Opportunity discovery
- Transaction batching

**Zerion:**
- Mobile-first portfolio tracking
- DeFi position management
- Market insights

### 3. Alpha Sources

**Twitter/X:**
- Follow airdrop hunters and researchers
- Monitor protocol announcements
- Track community sentiment

**Discord Communities:**
- Join protocol Discord servers
- Participate in community discussions
- Get early access to features

**Telegram Channels:**
- Airdrop alpha groups
- Real-time opportunity sharing
- Community coordination

## Airdrop Farming Calendar

### Daily Activities (5-10 minutes)
- Check for new protocol announcements
- Execute planned transactions
- Monitor gas prices for optimal timing
- Review portfolio positions

### Weekly Activities (30-60 minutes)
- Research new opportunities
- Analyze airdrop criteria updates
- Rebalance farming allocations
- Update tracking spreadsheets

### Monthly Activities (2-3 hours)
- Deep dive research on new protocols
- Evaluate farming strategy performance
- Adjust allocation based on results
- Plan next month's activities

## Success Metrics and KPIs

### 1. Financial Metrics

**ROI Calculation:**
\`ROI = (Airdrop Value - Farming Costs) / Farming Costs × 100\`

**Success Rate:**
\`Success Rate = Successful Airdrops / Total Protocols Farmed × 100\`

**Average Return per Protocol:**
\`Average Return = Total Airdrop Value / Number of Protocols\`

### 2. Efficiency Metrics

**Cost per Airdrop:**
\`Cost per Airdrop = Total Farming Costs / Number of Successful Airdrops\`

**Time ROI:**
\`Time ROI = Total Airdrop Value / Hours Invested\`

### 3. Risk Metrics

**Maximum Drawdown:**
- Largest loss from farming activities
- Includes opportunity costs

**Diversification Score:**
- Number of different protocols/chains farmed
- Risk distribution assessment

## Common Mistakes to Avoid

### 1. Over-Farming
- Using too many wallets (Sybil detection)
- Obvious farming patterns
- Ignoring protocol-specific rules

### 2. Under-Diversification
- Focusing on only one protocol
- Ignoring smaller opportunities
- Not spreading across chains

### 3. Poor Cost Management
- Farming during high gas periods
- Not accounting for opportunity costs
- Ignoring bridge fees and slippage

### 4. Lack of Patience
- Expecting immediate results
- Abandoning strategies too early
- Not maintaining long-term positions

## Future of Airdrop Farming

### 1. Evolving Criteria
- More sophisticated Sybil detection
- Focus on genuine usage over volume
- Integration with identity protocols

### 2. New Mechanisms
- Retroactive public goods funding
- Contribution-based distributions
- Skill-based allocations

### 3. Regulatory Considerations
- Potential tax implications
- KYC requirements for large airdrops
- Geographic restrictions`,
            keyTakeaways: [
              "Successful airdrop farming requires research, patience, and strategic execution",
              "Diversification across protocols and chains maximizes success probability",
              "Cost management and efficiency are crucial for profitability",
              "Genuine protocol usage is increasingly important over pure volume",
              "Airdrop farming is evolving with more sophisticated detection and criteria"
            ],
            practicalTask: {
              title: "Airdrop Farming Strategy Development",
              description: "Create and execute a comprehensive airdrop farming plan",
              instructions: [
                "Research and identify 5 protocols with high airdrop potential",
                "Analyze the criteria and costs for each opportunity",
                "Create a farming strategy with timeline and budget",
                "Set up tracking system for activities and costs",
                "Execute initial farming activities on 2-3 protocols",
                "Document all activities and create monitoring schedule"
              ],
              estimatedTime: "4 hours + ongoing execution",
              tools: ["DefiLlama", "DeBank", "Protocol websites", "Spreadsheet", "Multiple wallets"],
              completionCriteria: [
                "Identified 5 high-potential protocols",
                "Created detailed farming strategy",
                "Executed initial farming activities",
                "Set up proper tracking and monitoring"
              ],
              points: 100
            }
          }
        ]
      },
      {
        id: 4,
        title: "Degen Trading Simulator",
        description: "Practice high-risk trading strategies with virtual funds",
        estimatedTime: "Ongoing",
        xpReward: 0,
        isDemo: true,
        chapters: [
          {
            id: 1,
            title: "Live Trading Demo",
            duration: "Interactive",
            difficulty: "hard",
            xpReward: 0,
            tags: ["demo", "simulation", "practice"],
            content: `Practice everything you've learned with our advanced degen trading simulator.

## Trading Demo Features

### Real-Time Market Simulation
- Live price feeds for major cryptocurrencies and memecoins
- Realistic volatility modeling
- Social sentiment indicators
- News event simulation

### Available Assets
- **Major Cryptos**: BTC, ETH, SOL, AVAX, MATIC
- **Memecoins**: PEPE, SHIB, DOGE, BONK, FLOKI
- **Leverage**: Up to 100x (use responsibly!)
- **Starting Balance**: $10,000 virtual funds

### Advanced Features
- **Position Management**: Long/short positions with custom leverage
- **Risk Analytics**: Real-time P&L, liquidation prices, margin requirements
- **Social Trading**: See what other students are trading
- **Performance Tracking**: Win rate, Sharpe ratio, maximum drawdown
- **Leaderboards**: Compete with other degen traders

### Learning Objectives
1. **Risk Management**: Practice position sizing and stop losses
2. **Market Psychology**: Experience FOMO, fear, and greed in safe environment
3. **Strategy Testing**: Try different approaches without real money risk
4. **Performance Analysis**: Learn to track and improve trading metrics

### Demo Instructions
1. **Start Trading**: Click the demo button below to launch the simulator
2. **Choose Assets**: Select from available cryptocurrencies and memecoins
3. **Set Position**: Choose position size and leverage (start small!)
4. **Manage Risk**: Set stop losses and take profit levels
5. **Track Performance**: Monitor your P&L and trading statistics
6. **Learn and Iterate**: Analyze your trades and improve your strategy

### Safety Reminders
- This is a simulation - no real money is at risk
- Practice proper risk management even with virtual funds
- Don't let virtual wins encourage real-money gambling
- Focus on learning, not just profits
- Remember: 90% of traders lose money in real markets

### Getting Started Tips
1. **Start Conservative**: Begin with 2-3x leverage maximum
2. **Small Positions**: Risk only 1-2% per trade initially
3. **Set Stops**: Always use stop losses
4. **Track Everything**: Keep notes on your trades
5. **Stay Disciplined**: Stick to your trading plan

Ready to test your degen trading skills? Launch the simulator and start practicing!`,
            keyTakeaways: [
              "Practice makes perfect - use the simulator to test strategies safely",
              "Focus on risk management and discipline, not just profits",
              "Track your performance metrics to identify areas for improvement",
              "Virtual trading helps build confidence before risking real money",
              "Remember that real trading involves emotions that simulators can't replicate"
            ],
            practicalTask: {
              title: "Complete Trading Challenge",
              description: "Achieve specific performance targets in the trading simulator",
              instructions: [
                "Trade for at least 2 weeks in the simulator",
                "Execute minimum 20 trades across different assets",
                "Achieve positive returns with maximum 20% drawdown",
                "Maintain win rate above 40%",
                "Document your best and worst trades with analysis",
                "Create a final trading plan based on your experience"
              ],
              estimatedTime: "2 weeks ongoing",
              tools: ["Trading Simulator", "Performance tracker", "Trading journal"],
              completionCriteria: [
                "Completed 20+ trades over 2 weeks",
                "Achieved positive returns with controlled risk",
                "Documented trading performance and lessons learned",
                "Created comprehensive trading plan"
              ],
              points: 200
            },
            demoComponent: "TradingDemo",
            demoProps: {
              courseType: "degen"
            }
          }
        ]
      }
    ]
  },

  // Advanced Trading Course - Professional Strategies
  "advanced-trading": {
    id: "advanced-trading",
    title: "Advanced Trading: Technical Analysis & Derivatives",
    description: "Master professional trading strategies, technical analysis, and derivatives trading",
    longDescription: "Learn institutional-level trading strategies used by professional traders. Master technical analysis, derivatives, and risk management for consistent profits.",
    level: "Expert",
    duration: "3 weeks",
    color: "bg-red-500",
    gradient: "from-red-400 to-red-600",
    icon: "BarChart3",
    category: "trading",
    difficulty: 5,
    totalXP: 1500,
    skills: ["Technical Analysis", "Derivatives Trading", "Risk Management", "Portfolio Theory", "Market Psychology"],
    learningOutcomes: [
      "Master advanced technical analysis and chart patterns",
      "Trade options, futures, and perpetual contracts",
      "Implement professional risk management systems",
      "Build algorithmic trading strategies",
      "Understand market microstructure and psychology"
    ],
    certification: {
      available: true,
      requirements: ["Complete all modules", "Achieve 15%+ returns in simulator", "Pass professional trading exam"],
      credentialName: "Certified Professional Trader"
    },
    modules: [
      {
        id: 1,
        title: "Advanced Technical Analysis",
        description: "Professional chart reading and pattern recognition",
        estimatedTime: "1 week",
        xpReward: 500,
        chapters: [
          {
            id: 1,
            title: "Market Structure & Smart Money Concepts",
            duration: "30 min",
            difficulty: "hard",
            xpReward: 150,
            tags: ["technical-analysis", "market-structure", "smart-money"],
            content: `Learn to read markets like institutional traders using smart money concepts and market structure analysis.

**Market Structure Fundamentals:**

**Higher Highs & Higher Lows (Uptrend)**
- Price creates successive higher peaks and valleys
- Indicates strong buying pressure
- Trade pullbacks to support levels
- Target: Previous highs and extensions

**Lower Highs & Lower Lows (Downtrend)**
- Price creates successive lower peaks and valleys
- Indicates strong selling pressure
- Trade bounces to resistance levels
- Target: Previous lows and extensions

**Consolidation/Sideways**
- Price moves between defined support/resistance
- Accumulation or distribution phase
- Trade range boundaries
- Breakout direction determines trend

**Smart Money Concepts:**

**Order Blocks**
- Areas where institutions placed large orders
- Often appear as strong support/resistance
- Price tends to return to test these levels
- High probability reversal zones

**Fair Value Gaps (FVG)**
- Price imbalances on the chart
- Gaps that price tends to fill
- Created by aggressive buying/selling
- Act as magnets for future price action

**Liquidity Pools**
- Areas where stop losses cluster
- Above/below key levels and round numbers
- Smart money targets these areas
- Cause rapid price movements when hit

**Institutional Order Flow:**

**Accumulation Phase**
- Smart money quietly builds positions
- Price moves sideways with low volatility
- Volume decreases over time
- Retail loses interest

**Markup Phase**
- Smart money allows price to rise
- Retail FOMO creates momentum
- Volume increases significantly
- Media attention grows

**Distribution Phase**
- Smart money sells to retail buyers
- Price moves sideways at high levels
- High volatility and volume
- Retail euphoria peaks

**Markdown Phase**
- Smart money shorts or stays out
- Retail panic sells
- High volume on down moves
- Capitulation and despair

**Key Support & Resistance Levels:**

**Psychological Levels**
- Round numbers: $50,000, $100, $1.00
- Previous all-time highs
- Major moving averages (200 MA)
- Fibonacci retracement levels

**Volume Profile**
- Point of Control (POC): Highest volume level
- Value Area High/Low: 70% of volume
- Volume nodes: High activity areas
- Low volume nodes: Fast movement zones

**Advanced Chart Patterns:**

**Wyckoff Accumulation**
1. Selling Climax (SC): Heavy selling
2. Automatic Rally (AR): Dead cat bounce
3. Secondary Test (ST): Retest of lows
4. Spring: False breakdown below support
5. Last Point of Support (LPS): Final dip
6. Sign of Strength (SOS): Breakout begins

**ICT Concepts (Inner Circle Trader):**

**Kill Zones**
- London Open: 2-5 AM EST
- New York Open: 8-11 AM EST
- London Close: 10 AM-12 PM EST
- Highest probability trading windows

**Order Block Mitigation**
- Price returns to institutional order areas
- Often provides high probability entries
- Combine with other confluences
- Risk/reward ratios of 1:3+ common

**Liquidity Sweeps**
- Price briefly breaks key levels
- Triggers stop losses and orders
- Quickly reverses back into range
- Creates optimal entry opportunities

**Trading Psychology & Discipline:**

**Confirmation Bias**
- Seeking information that confirms beliefs
- Ignore contradictory evidence
- Solution: Devil's advocate analysis

**FOMO & Revenge Trading**
- Fear of missing out on moves
- Trying to recover losses quickly
- Solution: Strict position sizing rules

**Overconfidence**
- Believing you can predict markets
- Taking excessive risks after wins
- Solution: Maintain statistical mindset

**Professional Risk Management:**

**Position Sizing Formula**
Risk per trade = (Account Size × Risk %) ÷ (Entry - Stop Loss)

**Example:**
- Account: $100,000
- Risk per trade: 1% ($1,000)
- Entry: $50,000
- Stop loss: $48,000
- Position size: $1,000 ÷ $2,000 = 0.5 BTC

**Kelly Criterion**
Optimal position size = (Win Rate × Avg Win - Loss Rate × Avg Loss) ÷ Avg Win

**Sharpe Ratio**
Risk-adjusted returns = (Portfolio Return - Risk-free Rate) ÷ Portfolio Volatility

Target: Sharpe ratio > 1.0 for good performance`,
            keyTakeaways: [
              "Market structure reveals institutional order flow and trend direction",
              "Smart money concepts like order blocks and FVGs provide high-probability setups",
              "Liquidity pools above/below key levels are magnets for price movement",
              "Wyckoff methodology helps identify accumulation and distribution phases",
              "Professional risk management uses mathematical position sizing formulas"
            ],
            practicalTask: {
              title: "Market Structure Analysis",
              description: "Analyze Bitcoin's market structure using smart money concepts",
              instructions: [
                "Open Bitcoin daily chart on TradingView",
                "Identify current market structure (uptrend/downtrend/consolidation)",
                "Mark 3 order blocks from the last 30 days",
                "Identify 2 fair value gaps that were filled",
                "Find liquidity pools above and below current price",
                "Write a 250-word analysis with trade setup"
              ],
              estimatedTime: "75 minutes",
              tools: ["TradingView", "Chart analysis", "Screenshot tool"],
              completionCriteria: [
                "Correctly identified market structure",
                "Marked order blocks and FVGs accurately",
                "Provided clear trade setup with entry/exit levels"
              ],
              points: 75
            }
          }
        ]
      },
      {
        id: 2,
        title: "Professional Trading Simulator",
        description: "Master advanced trading strategies with institutional-grade tools",
        estimatedTime: "Ongoing",
        xpReward: 0,
        isDemo: true,
        chapters: [
          {
            id: 1,
            title: "Advanced Trading Demo",
            duration: "Interactive",
            difficulty: "expert",
            xpReward: 0,
            tags: ["demo", "professional", "advanced"],
            content: `Master professional trading strategies with our advanced institutional-grade simulator.

## Professional Trading Features

### Institutional-Grade Tools
- Advanced charting with 50+ technical indicators
- Options and futures trading simulation
- Portfolio optimization algorithms
- Risk analytics and VaR calculations
- Backtesting engine for strategy validation

### Available Instruments
- **Major Cryptocurrencies**: BTC, ETH, SOL, AVAX, MATIC
- **Derivatives**: Futures, options, perpetual swaps
- **Leverage**: Up to 10x (professional risk management)
- **Starting Capital**: $100,000 virtual funds

### Advanced Analytics
- **Risk Metrics**: Sharpe ratio, Sortino ratio, maximum drawdown
- **Performance Attribution**: Analyze what drives returns
- **Correlation Analysis**: Portfolio diversification insights
- **Stress Testing**: How portfolio performs in extreme scenarios
- **Factor Analysis**: Exposure to market factors

### Professional Features
- **Algorithmic Trading**: Create and test automated strategies
- **Portfolio Rebalancing**: Systematic portfolio management
- **Risk Budgeting**: Allocate risk across positions
- **Scenario Analysis**: Test different market conditions
- **Performance Benchmarking**: Compare to market indices

Ready to trade like a professional? Launch the advanced simulator and start building institutional-level skills!`,
            keyTakeaways: [
              "Professional trading requires systematic approaches and rigorous risk management",
              "Advanced analytics help identify what drives trading performance",
              "Backtesting is crucial for validating trading strategies",
              "Institutional traders focus on risk-adjusted returns, not just profits",
              "Continuous improvement through performance analysis is key to long-term success"
            ],
            practicalTask: {
              title: "Professional Trading Assessment",
              description: "Demonstrate mastery of professional trading concepts and tools",
              instructions: [
                "Develop a systematic trading strategy with clear rules",
                "Backtest the strategy on 6 months of historical data",
                "Implement the strategy in live simulation for 1 month",
                "Achieve Sharpe ratio above 1.0 with maximum 15% drawdown",
                "Create professional performance and risk reports",
                "Present strategy to peers with full documentation"
              ],
              estimatedTime: "1 month + strategy development",
              tools: ["Advanced Trading Simulator", "Backtesting engine", "Risk analytics", "Performance reporting"],
              completionCriteria: [
                "Developed and documented systematic trading strategy",
                "Completed comprehensive backtesting analysis",
                "Achieved target risk-adjusted returns in simulation",
                "Created professional-grade reports and presentation"
              ],
              points: 300
            },
            demoComponent: "TradingDemo",
            demoProps: {
              courseType: "advanced-trading"
            }
          }
        ]
      }
    ]
  },

  // Smart Contract Development Course
  development: {
    id: "development",
    title: "Smart Contract Development: Solidity to dApps",
    description: "Master smart contract development from Solidity basics to full-stack dApp deployment",
    longDescription: "Learn to build, test, and deploy smart contracts and decentralized applications. From Solidity fundamentals to advanced DeFi protocols and NFT marketplaces.",
    level: "Advanced",
    duration: "4 weeks",
    color: "bg-indigo-500",
    gradient: "from-indigo-400 to-indigo-600",
    icon: "Code",
    category: "development",
    difficulty: 4,
    totalXP: 2000,
    skills: ["Solidity Programming", "Smart Contract Security", "dApp Development", "Web3 Integration", "Testing & Deployment"],
    learningOutcomes: [
      "Write secure and efficient Solidity smart contracts",
      "Build full-stack dApps with React and Web3",
      "Deploy contracts on multiple blockchain networks",
      "Implement advanced DeFi and NFT functionality",
      "Master testing, security, and optimization techniques"
    ],
    certification: {
      available: true,
      requirements: ["Complete all modules", "Deploy 3 working dApps", "Pass security audit simulation"],
      credentialName: "Certified Blockchain Developer"
    },
    modules: [
      {
        id: 1,
        title: "Solidity Fundamentals",
        description: "Master the Solidity programming language and smart contract basics",
        estimatedTime: "1 week",
        xpReward: 500,
        chapters: [
          {
            id: 1,
            title: "Solidity Syntax and Data Types",
            duration: "45 min",
            difficulty: "medium",
            xpReward: 100,
            tags: ["solidity", "programming", "basics"],
            content: `Learn Solidity programming language fundamentals and start building your first smart contracts.

## What is Solidity?

Solidity is a high-level programming language designed for implementing smart contracts on Ethereum and other EVM-compatible blockchains. It's statically typed, supports inheritance, libraries, and complex user-defined types.

### Key Features:
- **Contract-oriented programming** - Everything revolves around contracts
- **Statically typed** - Variable types must be declared
- **Inheritance support** - Contracts can inherit from other contracts
- **Library system** - Reusable code components
- **Event logging** - Emit events for external applications

## Basic Solidity Structure

Every Solidity file starts with a license identifier and pragma statement:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MyFirstContract {
    // Contract code goes here
}
\`\`\`

### License Identifiers:
- **MIT** - Most permissive, allows commercial use
- **GPL-3.0** - Open source, requires derivative works to be open source
- **UNLICENSED** - All rights reserved

### Pragma Statements:
- **^0.8.19** - Compatible with 0.8.19 and higher (but not 0.9.0)
- **>=0.8.0 <0.9.0** - Specific version range
- **0.8.19** - Exact version only

## Data Types in Solidity

### Value Types

**Boolean:**
\`\`\`solidity
bool public isActive = true;
bool public isComplete = false;
\`\`\`

**Integers:**
\`\`\`solidity
uint256 public totalSupply = 1000000;  // Unsigned integer (0 to 2^256-1)
int256 public balance = -500;          // Signed integer (-2^255 to 2^255-1)
uint8 public percentage = 100;         // 8-bit unsigned (0 to 255)
\`\`\`

**Addresses:**
\`\`\`solidity
address public owner;                   // 20-byte Ethereum address
address payable public recipient;       // Can receive Ether
\`\`\`

**Bytes:**
\`\`\`solidity
bytes32 public hash;                    // Fixed-size byte array
bytes public data;                      // Dynamic byte array
\`\`\`

**Strings:**
\`\`\`solidity
string public name = "My Token";
string public symbol = "MTK";
\`\`\`

### Reference Types

**Arrays:**
\`\`\`solidity
uint256[] public numbers;               // Dynamic array
uint256[5] public fixedNumbers;         // Fixed-size array
address[] public participants;
\`\`\`

**Mappings:**
\`\`\`solidity
mapping(address => uint256) public balances;
mapping(uint256 => string) public tokenURIs;
mapping(address => mapping(address => uint256)) public allowances;
\`\`\`

**Structs:**
\`\`\`solidity
struct User {
    string name;
    uint256 age;
    bool isActive;
    address wallet;
}

User public admin;
mapping(address => User) public users;
\`\`\`

## State Variables and Visibility

### Visibility Modifiers:

**Public:**
- Accessible from anywhere
- Automatically creates getter function
\`\`\`solidity
uint256 public totalSupply;
\`\`\`

**Private:**
- Only accessible within the same contract
\`\`\`solidity
uint256 private _secretValue;
\`\`\`

**Internal:**
- Accessible within contract and derived contracts
\`\`\`solidity
uint256 internal _protectedValue;
\`\`\`

**External:**
- Only callable from outside the contract (for functions)
\`\`\`solidity
function externalFunction() external pure returns (string memory) {
    return "Called from outside";
}
\`\`\`

## Functions in Solidity

### Function Structure:
\`\`\`solidity
function functionName(parameters) visibility mutability returns (returnType) {
    // Function body
}
\`\`\`

### State Mutability:

**Pure Functions:**
- Don't read or modify state
- Only work with input parameters
\`\`\`solidity
function add(uint256 a, uint256 b) public pure returns (uint256) {
    return a + b;
}
\`\`\`

**View Functions:**
- Read state but don't modify it
\`\`\`solidity
function getBalance(address account) public view returns (uint256) {
    return balances[account];
}
\`\`\`

**Payable Functions:**
- Can receive Ether
\`\`\`solidity
function deposit() public payable {
    balances[msg.sender] += msg.value;
}
\`\`\`

## Events and Logging

Events allow external applications to listen for contract activity:

\`\`\`solidity
event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);

function transfer(address to, uint256 amount) public {
    balances[msg.sender] -= amount;
    balances[to] += amount;

    emit Transfer(msg.sender, to, amount);
}
\`\`\`

### Indexed Parameters:
- Up to 3 parameters can be indexed
- Indexed parameters are searchable in logs
- Non-indexed parameters are stored in log data

## Global Variables and Functions

### Message Context:
\`\`\`solidity
msg.sender    // Address of the caller
msg.value     // Amount of Ether sent (in wei)
msg.data      // Complete calldata
msg.sig       // Function selector (first 4 bytes of calldata)
\`\`\`

### Block Information:
\`\`\`solidity
block.timestamp    // Current block timestamp
block.number      // Current block number
block.difficulty  // Current block difficulty
block.coinbase    // Current block miner's address
\`\`\`

### Transaction Information:
\`\`\`solidity
tx.origin         // Original sender of the transaction
tx.gasprice      // Gas price of the transaction
\`\`\`

## Complete Example Contract

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleToken {
    // State variables
    string public name = "Simple Token";
    string public symbol = "SIM";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;

    // Mappings
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // Constructor
    constructor(uint256 _totalSupply) {
        totalSupply = _totalSupply * 10**decimals;
        balanceOf[msg.sender] = totalSupply;
        owner = msg.sender;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    // Transfer function
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        require(_to != address(0), "Invalid recipient");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // Approve function
    function approve(address _spender, uint256 _value) public returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Transfer from function
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");
        require(_to != address(0), "Invalid recipient");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
}
\`\`\`

## Best Practices

### 1. Use Latest Solidity Version
- Always use the latest stable version
- Take advantage of new security features
- Better gas optimization

### 2. Follow Naming Conventions
- **Contracts**: PascalCase (MyContract)
- **Functions**: camelCase (myFunction)
- **Variables**: camelCase (myVariable)
- **Constants**: UPPER_CASE (MAX_SUPPLY)

### 3. Use Explicit Visibility
- Always specify function visibility
- Make state variables explicit
- Avoid default visibility

### 4. Implement Proper Error Handling
- Use require() for input validation
- Use revert() for complex conditions
- Use assert() for internal errors

### 5. Gas Optimization
- Use uint256 instead of smaller uints
- Pack structs efficiently
- Use events instead of storage for logs`,
            keyTakeaways: [
              "Solidity is a contract-oriented programming language for Ethereum",
              "Understanding data types and visibility is crucial for smart contract development",
              "Functions can be pure, view, or state-changing with different gas costs",
              "Events provide a way for external applications to monitor contract activity",
              "Following best practices ensures secure and efficient smart contracts"
            ],
            practicalTask: {
              title: "Build Your First Token Contract",
              description: "Create and deploy a simple ERC-20 token contract",
              instructions: [
                "Open Remix IDE (remix.ethereum.org)",
                "Create a new file called 'MyToken.sol'",
                "Implement a basic ERC-20 token with name, symbol, and total supply",
                "Add transfer and balance checking functionality",
                "Compile the contract and deploy to Remix VM",
                "Test the contract by transferring tokens between accounts"
              ],
              estimatedTime: "90 minutes",
              tools: ["Remix IDE", "MetaMask (optional)", "Ethereum testnet"],
              completionCriteria: [
                "Contract compiles without errors",
                "Successfully deployed to test network",
                "Transfer function works correctly",
                "Events are emitted properly"
              ],
              points: 100
            }
          }
        ]
      },
      {
        id: 2,
        title: "Advanced Smart Contract Patterns",
        description: "Learn design patterns, security, and optimization techniques",
        estimatedTime: "1 week",
        xpReward: 600,
        chapters: [
          {
            id: 1,
            title: "Smart Contract Security and Common Vulnerabilities",
            duration: "50 min",
            difficulty: "hard",
            xpReward: 150,
            tags: ["security", "vulnerabilities", "best-practices"],
            content: `Master smart contract security to protect against common attacks and vulnerabilities.

## Why Security Matters

Smart contract vulnerabilities have led to billions in losses:

### Major Incidents:
- **The DAO (2016)**: $60M stolen via reentrancy attack
- **Parity Wallet (2017)**: $280M frozen due to library bug
- **bZx (2020)**: $8M lost through flash loan attacks
- **Poly Network (2021)**: $600M stolen (later returned)

## Common Vulnerabilities

### 1. Reentrancy Attacks

**The Problem:**
External calls can call back into your contract before state updates complete.

**Vulnerable Code:**
\`\`\`solidity
contract VulnerableBank {
    mapping(address => uint256) public balances;

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // VULNERABLE: External call before state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= amount;  // State update after external call
    }
}
\`\`\`

**Attack Contract:**
\`\`\`solidity
contract ReentrancyAttack {
    VulnerableBank public bank;

    constructor(address _bank) {
        bank = VulnerableBank(_bank);
    }

    function attack() public payable {
        bank.deposit{value: msg.value}();
        bank.withdraw(msg.value);
    }

    receive() external payable {
        if (address(bank).balance >= msg.value) {
            bank.withdraw(msg.value);  // Reentrant call
        }
    }
}
\`\`\`

**Secure Solution:**
\`\`\`solidity
contract SecureBank {
    mapping(address => uint256) public balances;
    bool private locked;

    modifier noReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    function withdraw(uint256 amount) public noReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // Update state BEFORE external call
        balances[msg.sender] -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
\`\`\`

### 2. Integer Overflow/Underflow

**The Problem:**
Arithmetic operations can wrap around, causing unexpected results.

**Vulnerable Code (Solidity < 0.8.0):**
\`\`\`solidity
contract VulnerableToken {
    mapping(address => uint256) public balances;

    function transfer(address to, uint256 amount) public {
        // VULNERABLE: No overflow check
        balances[msg.sender] -= amount;  // Can underflow
        balances[to] += amount;          // Can overflow
    }
}
\`\`\`

**Secure Solution:**
\`\`\`solidity
// Solidity 0.8.0+ has built-in overflow protection
contract SecureToken {
    mapping(address => uint256) public balances;

    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;  // Safe in 0.8.0+
        balances[to] += amount;          // Safe in 0.8.0+
    }
}
\`\`\`

### 3. Access Control Issues

**The Problem:**
Functions lack proper access controls, allowing unauthorized actions.

**Vulnerable Code:**
\`\`\`solidity
contract VulnerableContract {
    address public owner;
    uint256 public totalSupply;

    constructor() {
        owner = msg.sender;
    }

    // VULNERABLE: Anyone can mint tokens
    function mint(address to, uint256 amount) public {
        totalSupply += amount;
        // mint tokens...
    }
}
\`\`\`

**Secure Solution:**
\`\`\`solidity
contract SecureContract {
    address public owner;
    uint256 public totalSupply;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        totalSupply += amount;
        // mint tokens...
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
\`\`\`

### 4. Front-Running Attacks

**The Problem:**
Miners can see pending transactions and execute their own first.

**Vulnerable Scenario:**
\`\`\`solidity
contract VulnerableAuction {
    uint256 public highestBid;
    address public highestBidder;

    function bid() public payable {
        require(msg.value > highestBid, "Bid too low");

        // Refund previous bidder
        if (highestBidder != address(0)) {
            payable(highestBidder).transfer(highestBid);
        }

        highestBid = msg.value;
        highestBidder = msg.sender;
    }
}
\`\`\`

**Mitigation Strategies:**
1. **Commit-Reveal Scheme:**
\`\`\`solidity
contract SecureAuction {
    mapping(address => bytes32) public commitments;
    mapping(address => uint256) public bids;

    // Phase 1: Commit
    function commitBid(bytes32 commitment) public {
        commitments[msg.sender] = commitment;
    }

    // Phase 2: Reveal
    function revealBid(uint256 amount, uint256 nonce) public payable {
        bytes32 hash = keccak256(abi.encodePacked(amount, nonce, msg.sender));
        require(hash == commitments[msg.sender], "Invalid commitment");
        require(msg.value == amount, "Incorrect payment");

        bids[msg.sender] = amount;
    }
}
\`\`\`

### 5. Oracle Manipulation

**The Problem:**
Relying on single price sources that can be manipulated.

**Vulnerable Code:**
\`\`\`solidity
contract VulnerableDeFi {
    IPriceOracle public oracle;

    function liquidate(address user) public {
        uint256 price = oracle.getPrice();  // Single source

        if (getUserCollateralValue(user, price) < getUserDebt(user)) {
            // Liquidate user
        }
    }
}
\`\`\`

**Secure Solution:**
\`\`\`solidity
contract SecureDeFi {
    IPriceOracle[] public oracles;
    uint256 public constant MIN_ORACLES = 3;

    function getSecurePrice() internal view returns (uint256) {
        require(oracles.length >= MIN_ORACLES, "Insufficient oracles");

        uint256[] memory prices = new uint256[](oracles.length);
        for (uint256 i = 0; i < oracles.length; i++) {
            prices[i] = oracles[i].getPrice();
        }

        // Return median price
        return getMedian(prices);
    }
}
\`\`\`

## Security Best Practices

### 1. Use Established Patterns

**OpenZeppelin Contracts:**
\`\`\`solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SecureContract is ReentrancyGuard, Ownable, Pausable {
    function sensitiveFunction() public nonReentrant whenNotPaused onlyOwner {
        // Secure function implementation
    }
}
\`\`\`

### 2. Implement Circuit Breakers

\`\`\`solidity
contract CircuitBreaker {
    bool public emergencyStop = false;
    address public owner;

    modifier stopInEmergency() {
        require(!emergencyStop, "Contract is paused");
        _;
    }

    modifier onlyInEmergency() {
        require(emergencyStop, "Not in emergency");
        _;
    }

    function toggleEmergencyStop() public onlyOwner {
        emergencyStop = !emergencyStop;
    }
}
\`\`\`

### 3. Use Time Locks for Critical Functions

\`\`\`solidity
contract TimeLock {
    mapping(bytes32 => uint256) public timelock;
    uint256 public constant DELAY = 2 days;

    function scheduleTransaction(
        address target,
        bytes memory data
    ) public onlyOwner {
        bytes32 txHash = keccak256(abi.encode(target, data));
        timelock[txHash] = block.timestamp + DELAY;
    }

    function executeTransaction(
        address target,
        bytes memory data
    ) public onlyOwner {
        bytes32 txHash = keccak256(abi.encode(target, data));
        require(timelock[txHash] != 0, "Transaction not scheduled");
        require(block.timestamp >= timelock[txHash], "Transaction locked");

        (bool success, ) = target.call(data);
        require(success, "Transaction failed");

        delete timelock[txHash];
    }
}
\`\`\`

### 4. Implement Rate Limiting

\`\`\`solidity
contract RateLimited {
    mapping(address => uint256) public lastAction;
    uint256 public constant COOLDOWN = 1 hours;

    modifier rateLimited() {
        require(
            block.timestamp >= lastAction[msg.sender] + COOLDOWN,
            "Action too frequent"
        );
        lastAction[msg.sender] = block.timestamp;
        _;
    }

    function sensitiveAction() public rateLimited {
        // Implementation
    }
}
\`\`\`

## Security Tools and Auditing

### 1. Static Analysis Tools
- **Slither**: Detects common vulnerabilities
- **MythX**: Comprehensive security analysis
- **Securify**: Academic security scanner

### 2. Testing Frameworks
- **Hardhat**: Development environment with testing
- **Foundry**: Fast testing framework
- **Brownie**: Python-based testing

### 3. Formal Verification
- **Certora**: Formal verification platform
- **KEVM**: K framework for EVM
- **Dafny**: Microsoft's verification language

### 4. Bug Bounty Programs
- **Immunefi**: Largest Web3 bug bounty platform
- **HackerOne**: General bug bounty platform
- **Code4rena**: Competitive auditing

## Security Checklist

### Before Deployment:
- [ ] Use latest Solidity version
- [ ] Implement reentrancy protection
- [ ] Add proper access controls
- [ ] Use SafeMath or Solidity 0.8.0+
- [ ] Implement emergency stops
- [ ] Add input validation
- [ ] Use established libraries (OpenZeppelin)
- [ ] Conduct thorough testing
- [ ] Get professional audit
- [ ] Set up monitoring systems

### After Deployment:
- [ ] Monitor for unusual activity
- [ ] Have incident response plan
- [ ] Keep upgrade mechanisms secure
- [ ] Regular security reviews
- [ ] Stay updated on new vulnerabilities`,
            keyTakeaways: [
              "Reentrancy attacks can drain contracts - always update state before external calls",
              "Use Solidity 0.8.0+ for built-in overflow protection",
              "Implement proper access controls with modifiers and role-based permissions",
              "Oracle manipulation is a major DeFi risk - use multiple price sources",
              "Security is an ongoing process requiring tools, audits, and monitoring"
            ],
            practicalTask: {
              title: "Security Audit Simulation",
              description: "Identify and fix vulnerabilities in a provided smart contract",
              instructions: [
                "Download the vulnerable contract from the course materials",
                "Use Slither or another static analysis tool to scan for issues",
                "Identify at least 3 different types of vulnerabilities",
                "Write secure versions of the vulnerable functions",
                "Create test cases that demonstrate the vulnerabilities",
                "Document your findings in a security report"
              ],
              estimatedTime: "2 hours",
              tools: ["Slither", "Hardhat", "OpenZeppelin", "Remix IDE"],
              completionCriteria: [
                "Identified all major vulnerabilities",
                "Provided secure code fixes",
                "Created comprehensive test suite",
                "Documented findings professionally"
              ],
              points: 150
            }
          }
        ]
      }
    ]
  }
};
export const tradingDemoConfig = {
  degen: {
    title: "Degen Trading Simulator",
    description: "Practice high-risk trading strategies with virtual funds",
    features: [
      "Memecoin trading simulation",
      "Leverage trading up to 100x",
      "Social sentiment indicators",
      "Real-time market data",
      "Risk management tools"
    ],
    startingBalance: 10000,
    availableAssets: ["PEPE", "SHIB", "DOGE", "BONK", "FLOKI"],
    maxLeverage: 100
  },

  "advanced-trading": {
    title: "Professional Trading Simulator",
    description: "Master advanced trading strategies with institutional tools",
    features: [
      "Advanced charting tools",
      "Options and futures trading",
      "Portfolio optimization",
      "Risk analytics",
      "Backtesting engine"
    ],
    startingBalance: 100000,
    availableAssets: ["BTC", "ETH", "SOL", "AVAX", "MATIC"],
    maxLeverage: 10
  }
};
