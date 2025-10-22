# Crypto Twitter Bot

## Project Structure

```
crypto-twitter-bot/
├── src/
│   ├── config.js                 # Configuration management
│   ├── index.js                  # Main entry point
│   ├── manager.js                # Bot manager and CLI
│   ├── bot.js                    # Main bot logic
│   └── services/
│       ├── twitterService.js     # Twitter API integration
│       ├── cryptoAnalysisService.js # Crypto trend analysis
│       └── textGenerationService.js # AI text generation
├── package.json                  # Dependencies and scripts
├── env.example                   # Environment variables template
├── README.md                     # Main documentation
└── INSTALL.md                    # Installation guide
```

## Key Components

### 1. Twitter Service (`twitterService.js`)
- Fetches trending crypto topics
- Analyzes engagement metrics
- Posts tweets with rate limiting
- Handles Twitter API interactions

### 2. Crypto Analysis Service (`cryptoAnalysisService.js`)
- Analyzes trending topics
- Calculates sentiment scores
- Identifies market movements
- Generates trend explanations

### 3. Text Generation Service (`textGenerationService.js`)
- Uses OpenAI for content generation
- Creates summaries and explanations
- Formats content for Twitter
- Provides fallback content

### 4. Bot Manager (`bot.js` & `manager.js`)
- Schedules automated posts
- Manages bot lifecycle
- Handles graceful shutdown
- Provides CLI interface

## Configuration

The bot uses environment variables for configuration:

- **Twitter API**: Required for posting and data collection
- **OpenAI API**: Required for AI-powered content generation
- **Bot Settings**: Optional customization (schedule, limits, etc.)

## Usage Patterns

1. **Automated Mode**: Runs continuously with scheduled posts
2. **Manual Mode**: Force posts and get reports via CLI
3. **Development Mode**: Auto-restart on file changes

## Safety Features

- Rate limiting to prevent API abuse
- Error handling and graceful degradation
- Fallback content when AI fails
- Graceful shutdown on system signals

## Monitoring

- Console logs for real-time status
- Status command for bot health
- Analysis reports for trend insights
- Error tracking and recovery
