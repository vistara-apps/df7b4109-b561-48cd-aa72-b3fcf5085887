export const NICHES = [
  { id: 'crypto-dev', label: 'Crypto Development', icon: '⚡' },
  { id: 'creator-economy', label: 'Creator Economy', icon: '🎨' },
  { id: 'public-speaking', label: 'Public Speaking', icon: '🎤' },
  { id: 'web-development', label: 'Web Development', icon: '💻' },
  { id: 'entrepreneurship', label: 'Entrepreneurship', icon: '🚀' },
  { id: 'productivity', label: 'Productivity', icon: '⚡' },
  { id: 'leadership', label: 'Leadership', icon: '👑' },
  { id: 'marketing', label: 'Marketing', icon: '📈' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'fitness', label: 'Fitness & Health', icon: '💪' },
] as const;

export const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'Just starting out' },
  { id: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { id: 'advanced', label: 'Advanced', description: 'Experienced practitioner' },
] as const;

export const TIME_COMMITMENTS = [
  { id: '5min', label: '5 minutes', description: 'Quick daily action' },
  { id: '15min', label: '15 minutes', description: 'Focused practice' },
  { id: '30min', label: '30 minutes', description: 'Deep work session' },
] as const;

export const SAMPLE_TIPS = {
  'crypto-dev': {
    beginner: {
      content: "Start with understanding blockchain fundamentals before diving into smart contracts. Today, read about how transactions work on Base network.",
      actionItems: [
        "Visit Base documentation and read the 'Getting Started' section",
        "Create a Base testnet wallet and get some test ETH from the faucet"
      ]
    },
    intermediate: {
      content: "Practice writing secure smart contracts by implementing common patterns. Focus on reentrancy protection and proper access controls.",
      actionItems: [
        "Review OpenZeppelin's ReentrancyGuard implementation",
        "Write a simple contract with proper access control using Ownable"
      ]
    },
    advanced: {
      content: "Optimize your smart contracts for gas efficiency. Use assembly for critical operations and implement custom errors instead of require strings.",
      actionItems: [
        "Refactor one function in your current contract to use assembly",
        "Replace all require statements with custom errors in a contract"
      ]
    }
  },
  'public-speaking': {
    beginner: {
      content: "Build confidence by practicing your speech in front of a mirror. Focus on maintaining eye contact with your reflection.",
      actionItems: [
        "Practice a 2-minute introduction about yourself in front of a mirror",
        "Record yourself speaking and note areas for improvement"
      ]
    },
    intermediate: {
      content: "Master the art of storytelling by incorporating personal anecdotes into your presentations. Stories create emotional connections.",
      actionItems: [
        "Identify 3 personal stories that relate to your expertise",
        "Practice weaving one story into your next presentation"
      ]
    },
    advanced: {
      content: "Develop your unique speaking style by studying great speakers and adapting their techniques to your personality.",
      actionItems: [
        "Watch a TED talk and analyze the speaker's unique techniques",
        "Experiment with one new technique in your next presentation"
      ]
    }
  }
};
