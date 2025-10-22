require('dotenv').config();

const config = {
  twitter: {
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  bot: {
    username: process.env.BOT_USERNAME || 'crypto_trends_bot',
    postingSchedule: process.env.POSTING_SCHEDULE || '0 */6 * * *', // Every 6 hours
    maxTweetLength: parseInt(process.env.MAX_TWEET_LENGTH) || 280,
    enableReplies: process.env.ENABLE_REPLIES === 'true',
  },
  crypto: {
    trendingHashtagsLimit: parseInt(process.env.TRENDING_HASHTAGS_LIMIT) || 50,
    minMentionCount: parseInt(process.env.MIN_MENTION_COUNT) || 100,
    analysisTimeWindow: parseInt(process.env.ANALYSIS_TIME_WINDOW) || 24, // hours
  },
  rateLimit: {
    tweetRateLimit: parseInt(process.env.TWEET_RATE_LIMIT) || 10,
    apiCallDelay: parseInt(process.env.API_CALL_DELAY) || 1000,
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'TWITTER_API_KEY',
  'TWITTER_API_SECRET',
  'TWITTER_ACCESS_TOKEN',
  'TWITTER_ACCESS_TOKEN_SECRET',
  'TWITTER_BEARER_TOKEN',
  'OPENAI_API_KEY',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  console.error('Please copy env.example to .env and fill in the required values');
  process.exit(1);
}

module.exports = config;
