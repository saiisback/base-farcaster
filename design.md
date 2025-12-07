# 🪵 Baseneko (ベース猫)

> **"The Next Gen Neko. Feed your mind, evolve your pet."**

![Baseneko Banner](https://placekitten.com/800/300) **Baseneko** is a cozy, "Learn-to-Care" virtual pet game built on the **Base** blockchain. It combines the nostalgia of Tamagotchi with the power of Web3 and AI. You don't just buy food for your cat—you earn it by solving Math & Science problems generated instantly by AI.

🔴 **Live Demo:** [https://baseneko.vercel.app](https://baseneko.vercel.app)  
🔵 **Farcaster Frame:** [Warpcast Link](https://warpcast.com)

---

## 🏡 The Concept

In a world of fast trading and neon charts, **Baseneko** is a slow, cozy corner of the internet.

* **Adopt:** Mint a unique Pixel Neko on Base Sepolia (Free).
* **Nurture:** Your cat has on-chain needs (Hunger, Love, Hygiene).
* **Learn:** To get food items, you must enter the **"School"** and solve AI-generated quizzes.
* **Bond:** Every time you feed or play, it’s a real transaction on the blockchain—proof that you cared.

---

## 🎨 Design & Aesthetics

The UI is designed to feel like a warm cup of coffee or an old sketchbook. We strictly avoid "Cyberpunk" or "Dark Mode" vibes.

| Color | Hex | Usage |
| :--- | :--- | :--- |
| **Warm Brown** | `#5D4037` | Primary buttons, borders, text. |
| **Cozy Cream** | `#FFF8E1` | Backgrounds, cards, canvas. |
| **Pixel Green** | `#A5D6A7` | Success states, happy health bars. |
| **Retro Red** | `#EF5350` | Hunger bars, urgent alerts. |

* **Font:** Pixel-art style typography (e.g., 'Press Start 2P' or 'VT323').
* **Vibe:** Graph paper backgrounds, chunky borders, 8-bit sounds.

---

## 🥞 The Tech Stack

We built this with a focus on simplicity, warmth, and open-source tech.

| Component | Tech Used | Role |
| :--- | :--- | :--- |
| **Blockchain** | 🔵 **Base Sepolia** | The home of your Neko. Fast & cheap L2. |
| **Contracts** | 📜 **Solidity** | ERC-721 (Neko) & ERC-1155 (Badges). |
| **Frontend** | ⚛️ **Next.js + Tailwind** | A "Mobile-First" pixel-art dashboard. |
| **Database** | ⚡ **Supabase** | Real-time state (Hunger bars, Leaderboard). |
| **The Brain** | 🔌 **OpenRouter API** | Access to models like Llama 3 & Mistral for infinite quizzes. |
| **Wallet** | 💼 **OnchainKit** | Seamless wallet connection & transactions. |

---

## ⛓️ Smart Contracts & On-Chain Logic

The heart of the game lives on **Base Sepolia**.

### 1. The Neko Contract (ERC-721)
* **Address:** `0xYourContractAddressHere`
* **Function:** `adopt()` - Mints your unique pet.
* **Function:** `feed(tokenId)` - Records a feeding event on-chain.
* **Function:** `play(tokenId)` - Records a play session on-chain.
* **Why On-Chain?** Unlike Web2 games, your care history is permanent. The "Love Score" is stored in the contract mapping.

### 2. The Badges Contract (ERC-1155)
* **Address:** `0xYourBadgeContractAddressHere`
* **Purpose:** Rewards for "Smart Parents."
* **Logic:** When you pass a quiz in the app, you unlock the ability to mint badges.

---

## 🎖️ The 3 Badges

There are currently **3 Exclusive Badges** available to mint. Prove your dedication to unlock them.

| Badge Name | Requirement | Badge ID |
| :--- | :--- | :--- |
| **👶 First Words** | Complete your **1st Lesson** in School. | `1` |
| **🎓 The Scholar** | Teach your cat **3 Lessons** perfectly. | `2` |
| **❤️ Best Parent** | Keep your cat's Happiness > 90% and Feed it on-chain. | `3` |

---

## 🧠 Where is the AI? (OpenRouter)

We use **OpenRouter** to power the **"School Mode"**. This allows us to route requests to the best open-source models (like Llama 3 or Mistral) for fast, low-cost quiz generation.

1.  **User Input:** "I want to teach my cat about *Volcanoes*."
2.  **API Call:** `POST /api/quiz` sends the topic via OpenRouter.
3.  **Prompt:** *"You are a kind teacher for a 1st grader. Generate 3 simple questions about [Topic] in JSON format."*
4.  **Result:** The user answers the quiz. If 3/3 correct -> **+10 Intelligence XP** (Saved to Supabase).

---

## 🧶 Features & Screens

### 1. The Living Room (Dashboard)
A retro, graph-paper style interface using the **Cozy Cream** background.
* **Visuals:** Your Pixel Cat (Happy/Sad/Hungry states).
* **Stats:** Hunger Bar (Red), Happiness Bar (Yellow).
* **Actions:** Big, chunky **Warm Brown** buttons for "Feed" 🍗 and "Play" 🧶.

### 2. The Classroom (AI School)
* Type any subject (e.g., "Dinosaurs", "Crypto", "Music").
* Instant quiz generation via OpenRouter.
* **Reward:** Care Points + Intelligence Level Up.

### 3. The Leaderboard (Community)
* Ranks users by **Care Score** (Total Feed/Play Transactions).
* Uses Farcaster Usernames (e.g., `@dwr.eth`) for social proof.

---

## 📜 License

MIT License. Built with ❤️ for the **Base Hackathon**.