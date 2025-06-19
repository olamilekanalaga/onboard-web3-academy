export const daoGovernanceCourse = {
  id: 'dao-governance',
  title: 'DAO Participation & Governance',
  description: 'Learn how to participate in DAOs, vote on proposals, and contribute to decentralized organizations',
  level: 'Intermediate',
  duration: '2-3 weeks',
  xpReward: 800,
  modules: [
    {
      id: 'module-1',
      title: 'Understanding DAOs',
      estimatedTime: '1 week',
      chapters: [
        {
          id: 'chapter-1',
          title: 'What Are DAOs and Why They Matter',
          duration: '25 min',
          content: `
## DAOs: The Future of Organizations

### What is a DAO?
A **Decentralized Autonomous Organization (DAO)** is an organization governed by smart contracts and community voting, rather than traditional management structures.

### Key Characteristics:
- **Decentralized** - No single point of control
- **Autonomous** - Rules encoded in smart contracts
- **Transparent** - All decisions and finances are public
- **Democratic** - Token holders vote on decisions
- **Global** - Anyone can participate regardless of location

### How DAOs Work:
1. **Governance tokens** give voting power
2. **Proposals** are submitted by community members
3. **Voting** happens on-chain with tokens
4. **Execution** is automatic via smart contracts
5. **Treasury** is managed collectively

### Types of DAOs:

#### 1. Protocol DAOs
**Purpose:** Govern DeFi protocols
**Examples:** Uniswap, Aave, Compound
**What they vote on:** Protocol upgrades, fee changes, treasury allocation

#### 2. Investment DAOs
**Purpose:** Pool funds for investments
**Examples:** The LAO, MetaCartel Ventures
**What they vote on:** Investment decisions, portfolio management

#### 3. Social DAOs
**Purpose:** Community building and social activities
**Examples:** Friends with Benefits, Bankless DAO
**What they vote on:** Events, membership, community initiatives

#### 4. Service DAOs
**Purpose:** Provide services to other organizations
**Examples:** RaidGuild, LexDAO
**What they vote on:** Project selection, pricing, team structure

#### 5. Media DAOs
**Purpose:** Create and distribute content
**Examples:** Bankless DAO, Mirror
**What they vote on:** Content strategy, revenue sharing

### Real-World Examples:

#### Uniswap DAO:
- **Tokens:** UNI (400M+ tokens distributed)
- **Treasury:** $2.9B+ in assets
- **Decisions:** Fee switches, grant programs, protocol upgrades
- **Impact:** Governs the largest DEX in DeFi

#### Nouns DAO:
- **Concept:** One NFT auctioned daily forever
- **Treasury:** 29,000+ ETH
- **Decisions:** Fund creative projects and public goods
- **Unique:** Every Noun NFT = 1 vote

### Benefits of DAOs:
- **Global participation** - No geographic restrictions
- **Transparency** - All votes and finances public
- **Efficiency** - No bureaucratic delays
- **Innovation** - Rapid experimentation
- **Ownership** - Members own part of the organization

### Challenges:
- **Coordination** - Hard to align many people
- **Voter apathy** - Low participation rates
- **Technical barriers** - Requires crypto knowledge
- **Legal uncertainty** - Regulatory gray areas
- **Governance attacks** - Wealthy actors can dominate

### Why DAOs Matter:
1. **New organizational model** for the digital age
2. **Democratize access** to investment and governance
3. **Reduce intermediaries** and bureaucracy
4. **Enable global collaboration** at scale
5. **Align incentives** between users and platforms
          `,
          keyTakeaways: [
            'DAOs are organizations governed by smart contracts and community voting',
            'Different types serve various purposes: protocol, investment, social, service',
            'Governance tokens provide voting power in decisions',
            'DAOs offer transparency and global participation',
            'Challenges include coordination and voter apathy'
          ],
          xpReward: 70,
          difficulty: 'easy' as const,
          tags: ['dao-basics', 'governance', 'decentralization', 'community']
        },
        {
          id: 'chapter-2',
          title: 'DAO Governance Models and Structures',
          duration: '30 min',
          content: `
## The Architecture of Decentralized Governance

### Governance Token Models:

#### 1. One Token = One Vote
**How it works:** Each token equals one vote
**Examples:** Uniswap (UNI), Compound (COMP)
**Pros:** Simple, proportional to stake
**Cons:** Whale dominance, plutocracy risk

#### 2. Quadratic Voting
**How it works:** Cost increases quadratically (1 vote = 1 token, 2 votes = 4 tokens)
**Examples:** Gitcoin Grants
**Pros:** Reduces whale influence, more democratic
**Cons:** Complex, still gameable

#### 3. Reputation-Based
**How it works:** Voting power based on contributions, not just tokens
**Examples:** DAOstack, Colony
**Pros:** Rewards active participants
**Cons:** Subjective, hard to measure

#### 4. Delegated Voting
**How it works:** Token holders delegate votes to representatives
**Examples:** ENS, Optimism
**Pros:** Higher participation, expert decision-making
**Cons:** Centralization risk, representative capture

### Proposal Lifecycle:

#### Stage 1: Discussion
- **Forum posts** - Initial idea sharing
- **Community feedback** - Gather input and refine
- **Temperature checks** - Gauge interest
- **Duration:** 1-2 weeks

#### Stage 2: Formal Proposal
- **Structured format** - Clear objectives and implementation
- **Technical review** - Security and feasibility check
- **Quorum requirements** - Minimum participation needed
- **Duration:** 3-7 days

#### Stage 3: Voting
- **On-chain voting** - Using governance tokens
- **Voting period** - Usually 3-7 days
- **Threshold requirements** - Minimum approval percentage
- **Results:** Binding and automatic

#### Stage 4: Execution
- **Timelock delays** - Security buffer (24-48 hours)
- **Smart contract execution** - Automatic implementation
- **Monitoring** - Track implementation success

### Governance Frameworks:

#### Governor Alpha/Bravo (Compound)
- **Features:** Proposal submission, voting, execution
- **Adoption:** Widely used across DeFi
- **Pros:** Battle-tested, secure
- **Cons:** Limited flexibility

#### Snapshot
- **Features:** Off-chain voting, gas-free
- **Adoption:** 1000+ DAOs use it
- **Pros:** No gas costs, flexible
- **Cons:** Requires separate execution

#### Aragon
- **Features:** Full DAO framework
- **Adoption:** 1700+ DAOs created
- **Pros:** Complete solution, user-friendly
- **Cons:** More complex setup

### Voting Mechanisms:

#### Simple Majority
- **Requirement:** >50% of votes
- **Use case:** Standard decisions
- **Risk:** Tyranny of majority

#### Supermajority
- **Requirement:** 60-80% of votes
- **Use case:** Major changes
- **Benefit:** Broader consensus

#### Quorum Requirements
- **Requirement:** Minimum participation (e.g., 10% of tokens)
- **Purpose:** Prevent low-turnout decisions
- **Challenge:** Achieving sufficient participation

### Treasury Management:

#### Multi-Sig Treasuries
- **Security:** Requires multiple signatures
- **Examples:** 3-of-5 or 5-of-9 setups
- **Pros:** Secure, flexible
- **Cons:** Centralization risk

#### On-Chain Treasuries
- **Security:** Governed by smart contracts
- **Examples:** Compound, Uniswap
- **Pros:** Fully decentralized
- **Cons:** Less flexible

#### Streaming Payments
- **Concept:** Continuous payment over time
- **Tools:** Sablier, Superfluid
- **Benefits:** Reduces trust, aligns incentives

### Common Governance Issues:

#### Voter Apathy
- **Problem:** Low participation rates (often <10%)
- **Solutions:** Incentives, delegation, better UX

#### Whale Dominance
- **Problem:** Large holders control decisions
- **Solutions:** Quadratic voting, reputation systems

#### Governance Attacks
- **Problem:** Malicious proposals or vote buying
- **Solutions:** Timelocks, guardian roles, social consensus

#### Coordination Failure
- **Problem:** Difficulty aligning diverse stakeholders
- **Solutions:** Clear communication, structured processes
          `,
          keyTakeaways: [
            'Different voting models have various trade-offs',
            'Proposals follow structured lifecycles from discussion to execution',
            'Multiple governance frameworks exist with different features',
            'Treasury management requires balancing security and flexibility',
            'Common issues include voter apathy and whale dominance'
          ],
          xpReward: 70,
          difficulty: 'medium' as const,
          tags: ['governance-models', 'voting-mechanisms', 'proposals', 'treasury']
        }
      ]
    },
    {
      id: 'module-2',
      title: 'Participating in DAOs',
      estimatedTime: '1 week',
      chapters: [
        {
          id: 'chapter-3',
          title: 'How to Find and Join DAOs',
          duration: '25 min',
          content: `
## Finding Your DAO Community

### Where to Discover DAOs:

#### 1. DAO Aggregators
- **DeepDAO** - Comprehensive DAO analytics and rankings
- **DAOlist** - Curated directory of active DAOs
- **Messari Governor** - Governance tracking across protocols
- **Boardroom** - DAO governance hub

#### 2. Social Platforms
- **Discord servers** - Most DAOs have active communities
- **Twitter** - Follow DAO accounts and governance updates
- **Reddit** - r/ethereum, r/defi for discussions
- **Telegram** - Many DAOs use for quick communication

#### 3. DeFi Protocols
- **Use protocols first** - Understand before governing
- **Earn governance tokens** - Through liquidity provision or usage
- **Join forums** - Most have governance discussion areas

### Evaluating DAOs Before Joining:

#### Financial Health
- **Treasury size** - Check on DeepDAO or protocol sites
- **Revenue streams** - Understand how DAO makes money
- **Burn rate** - How quickly they spend funds
- **Token distribution** - Avoid overly concentrated ownership

#### Community Activity
- **Discord/forum activity** - Daily active members
- **Proposal frequency** - Regular governance activity
- **Voting participation** - >10% is good, >20% is excellent
- **Developer activity** - GitHub commits and updates

#### Governance Quality
- **Clear processes** - Well-defined proposal procedures
- **Transparent communication** - Regular updates and reports
- **Diverse participation** - Not dominated by few voices
- **Successful execution** - Proposals actually get implemented

### Joining Process:

#### Step 1: Research Phase
- Read whitepaper and documentation
- Join Discord/Telegram without tokens first
- Observe governance discussions
- Understand the DAO's mission and values

#### Step 2: Small Participation
- Buy small amount of governance tokens
- Participate in discussions
- Vote on proposals
- Attend community calls

#### Step 3: Active Contribution
- Submit proposals or feedback
- Join working groups
- Take on bounties or tasks
- Build reputation in community

### Types of Participation:

#### Passive Participation
- **Token holding** - Basic membership
- **Voting** - Participate in governance
- **Monitoring** - Stay informed on decisions
- **Time commitment:** 1-2 hours/week

#### Active Participation
- **Forum discussions** - Share ideas and feedback
- **Working groups** - Join specific initiatives
- **Proposal creation** - Submit governance proposals
- **Time commitment:** 5-10 hours/week

#### Core Contribution
- **Leadership roles** - Become a delegate or committee member
- **Full-time work** - Get paid by the DAO
- **Strategic planning** - Help shape DAO direction
- **Time commitment:** 20+ hours/week

### Red Flags to Avoid:

#### Governance Red Flags
- Anonymous team with no track record
- No clear governance process
- Extremely low voting participation
- Proposals that always pass without discussion

#### Financial Red Flags
- Unclear tokenomics or infinite inflation
- Treasury controlled by few people
- No revenue model or sustainability plan
- Recent security incidents or hacks

#### Community Red Flags
- Toxic or unwelcoming community
- Censorship of dissenting opinions
- Pump-and-dump focused discussions
- Lack of transparency in operations

### Getting Started Checklist:
1. ✅ Research the DAO's mission and values
2. ✅ Check financial health and governance activity
3. ✅ Join community channels and observe
4. ✅ Buy small amount of governance tokens
5. ✅ Participate in first vote
6. ✅ Introduce yourself to the community
7. ✅ Find ways to contribute your skills
          `,
          keyTakeaways: [
            'Use DAO aggregators and social platforms to discover opportunities',
            'Evaluate financial health, community activity, and governance quality',
            'Start with small participation before making larger commitments',
            'Different levels of participation require different time commitments',
            'Watch for red flags in governance, finances, and community'
          ],
          xpReward: 70,
          difficulty: 'easy' as const,
          tags: ['dao-discovery', 'joining-daos', 'community', 'evaluation']
        },
        {
          id: 'chapter-4',
          title: 'Voting Strategies and Best Practices',
          duration: '30 min',
          content: `
## Becoming an Effective DAO Voter

### Understanding Your Voting Power:

#### Token-Based Voting
- **Voting weight** = Number of tokens held
- **Delegation** - Can delegate to others
- **Snapshot timing** - Tokens counted at specific block
- **Lock-up periods** - Some DAOs require token locking

#### Calculating Impact:
- **Your tokens / Total voting tokens = Your influence**
- Example: 1,000 UNI / 100M voting UNI = 0.001% influence
- **Quorum impact** - Your vote helps reach minimum participation

### Pre-Voting Research:

#### Read the Full Proposal
- **Title and summary** - Understand basic concept
- **Motivation** - Why is this needed?
- **Specification** - Technical implementation details
- **Risks and considerations** - Potential downsides

#### Check Discussion Forums
- **Community sentiment** - What others are saying
- **Expert opinions** - Technical reviewers' feedback
- **Concerns raised** - Potential issues identified
- **Alternative solutions** - Other approaches suggested

#### Analyze Financial Impact
- **Treasury impact** - How much will this cost?
- **Revenue implications** - Will this generate income?
- **Token economics** - Effect on token value
- **Opportunity cost** - What else could the funds do?

### Voting Strategies:

#### Conservative Approach
- **Default to "No"** - Only vote "Yes" for clearly beneficial proposals
- **Risk aversion** - Prefer status quo over uncertain changes
- **High bar** - Require strong evidence and consensus
- **Best for:** Large token holders, risk-averse participants

#### Progressive Approach
- **Default to "Yes"** - Support experimentation and innovation
- **Risk tolerance** - Accept some failures for potential gains
- **Low bar** - Support proposals with reasonable potential
- **Best for:** Small holders, innovation-focused participants

#### Balanced Approach
- **Case-by-case** - Evaluate each proposal individually
- **Risk assessment** - Weigh potential benefits vs. costs
- **Community alignment** - Consider broader ecosystem impact
- **Best for:** Most participants, long-term thinking

### Common Voting Scenarios:

#### Treasury Allocation Proposals
**Questions to ask:**
- Is the amount reasonable for the expected outcome?
- Does the recipient have a track record of delivery?
- Are there clear milestones and accountability measures?
- What happens if the project fails?

**Example:** Uniswap's $74M DeFi Education Fund
- **Controversy:** Large amount, unclear oversight
- **Outcome:** Passed but with community criticism
- **Lesson:** Even good intentions need clear execution plans

#### Protocol Upgrade Proposals
**Questions to ask:**
- Has the code been audited by reputable firms?
- What are the security risks of the upgrade?
- Is there broad developer consensus?
- Can the upgrade be reversed if needed?

#### Fee Structure Changes
**Questions to ask:**
- How will this affect different user groups?
- What's the impact on protocol competitiveness?
- Are there alternative fee structures to consider?
- How will revenue be used?

### Delegation Strategies:

#### When to Delegate
- **Time constraints** - Can't research every proposal
- **Technical complexity** - Proposals beyond your expertise
- **Aligned interests** - Delegate shares your values
- **Active participation** - Delegate votes regularly

#### Choosing Delegates
- **Track record** - How have they voted historically?
- **Communication** - Do they explain their reasoning?
- **Alignment** - Do their values match yours?
- **Activity level** - Do they participate consistently?

#### Popular Delegate Platforms
- **Boardroom** - Delegate profiles and voting history
- **Tally** - Governance dashboard with delegate info
- **Snapshot** - Many DAOs support delegation here

### Voting Tools and Platforms:

#### On-Chain Voting
- **Governor contracts** - Direct blockchain voting
- **Gas costs** - Requires ETH for transaction fees
- **Finality** - Votes are permanent and binding
- **Examples:** Compound, Uniswap governance

#### Off-Chain Voting (Snapshot)
- **Gas-free** - No transaction costs
- **Flexible** - Various voting mechanisms
- **Non-binding** - Requires separate execution
- **Examples:** Most DAOs use for temperature checks

### Best Practices:

#### Before Voting:
1. ✅ Read the full proposal and discussion
2. ✅ Understand financial and technical implications
3. ✅ Consider long-term ecosystem impact
4. ✅ Check if you have conflicts of interest
5. ✅ Decide based on DAO's best interests

#### During Voting:
1. ✅ Vote within the designated timeframe
2. ✅ Double-check your vote before submitting
3. ✅ Consider explaining your reasoning publicly
4. ✅ Monitor voting progress and discussion

#### After Voting:
1. ✅ Follow implementation progress
2. ✅ Evaluate outcomes vs. expectations
3. ✅ Learn from results for future votes
4. ✅ Provide feedback on governance process

### Common Voting Mistakes:
- **Not reading proposals** - Voting based on titles only
- **Following the crowd** - Not thinking independently
- **Ignoring implementation** - Not considering execution difficulty
- **Short-term thinking** - Focusing only on immediate benefits
- **Conflict of interest** - Voting for personal gain over DAO benefit
          `,
          keyTakeaways: [
            'Understand your voting power and how it\'s calculated',
            'Research proposals thoroughly before voting',
            'Choose voting strategies that align with your risk tolerance',
            'Consider delegation when you lack time or expertise',
            'Follow best practices for informed decision-making'
          ],
          xpReward: 70,
          difficulty: 'medium' as const,
          tags: ['voting-strategies', 'delegation', 'proposal-analysis', 'best-practices']
        }
      ]
    }
  ]
};
