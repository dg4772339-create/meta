# Crypto Twitter Bot - Installation Guide

## Quick Start 🚀

1. **Install Node.js** (version 16 or higher)
2. **Clone and setup**:
   ```bash
   git clone <your-repo>
   cd crypto-twitter-bot
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

4. **Run the bot**:
   ```bash
   npm start
   ```

## API Keys Setup 🔑

### Twitter API (Required)
1. Visit [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Generate these credentials:
   - API Key
   - API Secret
   - Access Token
   - Access Token Secret
   - Bearer Token

### OpenAI API (Required)
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add credits to your account

## Environment Variables 📝

Copy `env.example` to `.env` and fill in:

```env
# Twitter API Credentials
TWITTER_API_KEY=your_key_here
TWITTER_API_SECRET=your_secret_here
TWITTER_ACCESS_TOKEN=your_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_token_secret_here
TWITTER_BEARER_TOKEN=your_bearer_token_here

# OpenAI API Key
OPENAI_API_KEY=your_openai_key_here

# Bot Configuration (Optional)
BOT_USERNAME=your_bot_username
POSTING_SCHEDULE=0 */6 * * *
```

## Commands 💻

```bash
# Start bot
npm start

# Development mode
npm run dev

# Check status
node src/manager.js --status

# Force post
node src/manager.js --force-post

# Get report
node src/manager.js --report
```

## Troubleshooting 🔧

- **Rate Limits**: Bot handles automatically
- **API Errors**: Check credentials in `.env`
- **Missing Dependencies**: Run `npm install`
- **Permission Errors**: Ensure Twitter app has write permissions

## Features ✨

- Analyzes crypto trends from Twitter
- Generates AI-powered explanations
- Posts every 6 hours automatically
- Includes sentiment analysis
- Educational content about crypto concepts

---

**Ready to analyze crypto trends! 📊🚀**
