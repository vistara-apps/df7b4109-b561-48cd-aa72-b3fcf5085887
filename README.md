# Совет Дня (Sovet Dnya) - Base MiniApp

Your daily dose of personalized, niche-specific wisdom to achieve your goals.

## Features

- **Personalized Daily Tips**: AI-generated advice tailored to your specific goals and niche
- **Progress Tracking**: Streak counters, weekly progress, and achievement system
- **Base Integration**: Built as a Base MiniApp with OnchainKit integration
- **Multiple Themes**: Support for different blockchain themes (Base, CELO, Solana, etc.)
- **Mobile-First Design**: Optimized for mobile experience within Farcaster frames

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base Network via OnchainKit
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety throughout
- **State Management**: React hooks with localStorage persistence

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.local` and add your API keys:
   ```bash
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Architecture

### Core Components

- **AppShell**: Main layout wrapper with header and navigation
- **TipCard**: Displays daily tips with action items
- **ProgressTracker**: Shows streaks and weekly progress
- **OnboardingForm**: Multi-step user goal and niche selection
- **ThemeProvider**: Handles theme switching and persistence

### Data Model

- **User**: Goal, niche, preferences, and onboarding status
- **DailyTip**: Generated content with action items and metadata
- **ProgressLog**: Completion tracking and streak calculation

### Theme System

The app supports multiple themes optimized for different blockchain communities:

- **Default**: Warm social theme with coral accents
- **CELO**: Black background with yellow accents
- **Solana**: Purple gradient theme
- **Base**: Clean blue design
- **Coinbase**: Professional navy theme

## Deployment

The app is designed to be deployed as a Base MiniApp and can be integrated into Farcaster frames.

### Build for production:
```bash
npm run build
npm start
```

## Business Model

- **Micro-transactions**: Pay-per-tip ($0.10 - $0.50)
- **Subscription**: Monthly unlimited access ($3-$5/mo)
- **Base Network**: Leverages Base for seamless payments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
