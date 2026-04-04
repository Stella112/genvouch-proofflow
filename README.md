# 🛡️ GenVouch: AI-Native Decentralized Credit Union

![GenVouch Banner](https://genvouch-proofflow.vercel.app/og-image.png) **Live Demo:** [genvouch-proofflow.vercel.app](https://genvouch-proofflow.vercel.app/)  
**Track:** Subjective Consensus (GenLayer Bradbury Testnet)

---

## The Problem
Traditional Web3 lending is fundamentally broken for the global unbanked. It strictly requires over-collateralization because standard smart contracts cannot evaluate subjective, real-world creditworthiness or off-chain reputation. Meanwhile, traditional global microfinance relies on localized human trust, which cannot scale on the blockchain. 

## 💡 The Solution
**GenVouch** is the first trustless, AI-powered decentralized credit union built exclusively on **GenLayer StudioNet**. 

Instead of relying on centralized KYC bureaus or human loan officers, GenVouch utilizes GenLayer’s Intelligent Contracts to autonomously read live web evidence (e.g., SaaS invoices, GitHub commits, or identity verification pages) and form a **Subjective Consensus** on a borrower's credit risk. It enables truly uncollateralized, trustless lending for the AI era.

---

## Core Features

*  **ProofFlow (AI Consensus Engine):** Borrowers submit a loan purpose alongside a standard real-world web URL. GenVouch triggers `gl.eq_principle` to deploy independent AI validators that read the URL context, analyze the risk, and reach a democratic consensus to approve or reject the loan entirely on-chain.
* **Lending Circles (ROSCA):** Users can pool funds together into decentralized Rotating Savings and Credit Associations, governed by smart contracts.
* **LexGuard Insurance:** A parametric safety layer. If a loan defaults, LexGuard can be triggered to autonomously verify the default and distribute pooled insurance funds.
* **Neo-Banking UX:** A frictionless, single-page React application that abstracts away Web3 complexity while providing immutable on-chain verification badges for all AI decisions.

---

## Architecture & Tech Stack

**Frontend:**
* React (Vite)
* Tailwind CSS
* shadcn/ui & Lucide Icons
* Vanilla `ethers.js` / `window.ethereum` for pure Web3 RPC connections.

**Backend / Smart Contracts:**
* Written in `py-genlayer`
* Deployed on **GenLayer StudioNet** (Simulator)
* Contract Address: `0x9E50680497c14Eb7057Bed10F5d9f9E9B000e6C0`

---

## GenLayer Integration Details

GenVouch was built to natively exploit GenLayer's unique capabilities:
1. **Subjective Oracles:** We completely bypass Chainlink or traditional oracles. Web scraping and contextual comprehension are done natively by the GenVM.
2. **Optimistic Democracy:** By utilizing GenLayer's AI validator nodes, we guarantee that the market outcome is determined trustlessly. If the AI nodes are uncertain or cannot reach a democratic consensus, the contract triggers a programmatic safety loop.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a Web3 wallet like MetaMask.

### 1. Clone & Install
```bash
git clone [https://github.com/Stella112/genvouch-proofflow.git](https://github.com/Stella112/genvouch-proofflow.git)
cd genvouch-proofflow
npm install

npm run dev`



---

### 3. Connect to GenLayer Testnet
When interacting with the local app, clicking "Connect Wallet" will automatically prompt your MetaMask to add the GenLayer RPC. If you need to add it manually, use these parameters:
* **Network Name:** GenLayer Simulator
* **RPC URL:** `https://studio.genlayer.com/rpc`
* **Chain ID:** `540` (0x21c)
* **Currency Symbol:** `GEN`

---

## 🤝 Built For
Built with ❤️ for the **DoraHacks GenLayer Bradbury Hackathon**.
