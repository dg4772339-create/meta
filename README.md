# Crypto Twitter Bot 🤖📊

A sophisticated Twitter bot that analyzes cryptocurrency trending topics on Twitter and synthesizes them into informative posts with explanations in English.

## Features ✨

- **Real-time Crypto Trend Analysis**: Monitors trending cryptocurrency hashtags and topics
- **AI-Powered Content Generation**: Uses OpenAI to create engaging explanations and summaries
- **Sentiment Analysis**: Analyzes market sentiment from social media discussions
- **Automated Posting**: Scheduled posts with customizable frequency
- **Educational Content**: Provides explanations of crypto concepts and market movements
- **Rate Limiting**: Respects Twitter API limits and prevents spam

## How It Works 🔧

1. **Data Collection**: Scans Twitter for crypto-related hashtags and trending topics
2. **Analysis**: Processes engagement metrics, sentiment, and trend strength
3. **Synthesis**: Uses AI to generate comprehensive summaries and explanations
4. **Posting**: Publishes formatted content to Twitter with relevant hashtags

## Installation 🚀

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd crypto-twitter-bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Fill in your API credentials in the `.env` file:
   - Twitter API credentials (from Twitter Developer Portal)
   - OpenAI API key (from OpenAI Platform)

4. **Run the bot**:
   ```bash
   npm start
   ```

## Configuration ⚙️

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TWITTER_API_KEY` | Twitter API Key | ✅ |
| `TWITTER_API_SECRET` | Twitter API Secret | ✅ |
| `TWITTER_ACCESS_TOKEN` | Twitter Access Token | ✅ |
| `TWITTER_ACCESS_TOKEN_SECRET` | Twitter Access Token Secret | ✅ |
| `TWITTER_BEARER_TOKEN` | Twitter Bearer Token | ✅ |
| `OPENAI_API_KEY` | OpenAI API Key | ✅ |
| `BOT_USERNAME` | Your bot's Twitter username | ❌ |
| `POSTING_SCHEDULE` | Cron schedule for posts (default: every 6 hours) | ❌ |
| `MAX_TWEET_LENGTH` | Maximum tweet length (default: 280) | ❌ |

### Bot Settings

- **Posting Schedule**: Default is every 6 hours (`0 */6 * * *`)
- **Rate Limiting**: Maximum 10 posts per day
- **Analysis Window**: 24-hour rolling window for trend analysis
- **Trending Limit**: Top 50 trending hashtags analyzed

## Usage 📱

### Basic Usage
```bash
# Start the bot
npm start

# Development mode with auto-restart
npm run dev
```

### Advanced Usage
```bash
# Check bot status
node src/manager.js --status

# Force a manual post
node src/manager.js --force-post

# Get analysis report
node src/manager.js --report
```

## API Setup 🔑

### Twitter API Setup
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Generate API keys and tokens
4. Enable OAuth 2.0 and OAuth 1.0a
5. Add your credentials to `.env`

### OpenAI API Setup
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add the key to your `.env` file

## Bot Behavior 🤖

### Content Generation
- Analyzes trending crypto hashtags (#bitcoin, #ethereum, #defi, etc.)
- Calculates sentiment from tweet engagement and content
- Generates educational explanations using AI
- Formats content for Twitter with appropriate hashtags

### Posting Schedule
- Posts every 6 hours by default
- Respects Twitter rate limits
- Includes market sentiment analysis
- Provides educational content about crypto trends

### Safety Features
- Rate limiting to prevent API abuse
- Error handling and graceful degradation
- Fallback content when AI generation fails
- Graceful shutdown on system signals

## Monitoring 📊

The bot provides several monitoring options:

- **Status Check**: `node src/manager.js --status`
- **Analysis Report**: `node src/manager.js --report`
- **Console Logs**: Real-time status updates and error messages

## Troubleshooting 🔧

### Common Issues

1. **API Rate Limits**: The bot automatically handles rate limiting
2. **Missing Environment Variables**: Check your `.env` file
3. **Twitter API Errors**: Verify your API credentials and permissions
4. **OpenAI Errors**: Ensure your API key is valid and has credits

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm start
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License 📄

MIT License - see LICENSE file for details

## Disclaimer ⚠️

This bot is for educational purposes only. Cryptocurrency investments carry risk. Always do your own research before making investment decisions. The bot's analysis should not be considered financial advice.

## Support 💬

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the logs for error messages

---

**Happy Trading! 🚀📈**
