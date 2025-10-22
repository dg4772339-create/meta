const OpenAI = require('openai');
const config = require('../config');

class TextGenerationService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  /**
   * Generate a comprehensive crypto trends summary
   */
  async generateTrendsSummary(analysis) {
    try {
      const prompt = this.buildTrendsSummaryPrompt(analysis);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a cryptocurrency market analyst who creates engaging, informative summaries of crypto trends for Twitter. Write in English, be concise but informative, and use emojis appropriately."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating trends summary:', error);
      return this.generateFallbackSummary(analysis);
    }
  }

  /**
   * Generate individual trend explanations
   */
  async generateTrendExplanation(trend) {
    try {
      const prompt = this.buildTrendExplanationPrompt(trend);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a crypto expert explaining trending topics. Write clear, educational explanations in English that help people understand what's happening in crypto markets."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.6,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating trend explanation:', error);
      return trend.explanation; // Fallback to basic explanation
    }
  }

  /**
   * Generate market sentiment analysis
   */
  async generateMarketSentimentAnalysis(analysis) {
    try {
      const prompt = this.buildSentimentAnalysisPrompt(analysis);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a crypto market sentiment analyst. Provide insights about market mood and what it means for traders and investors. Write in English with clear explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.5,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating sentiment analysis:', error);
      return this.generateFallbackSentimentAnalysis(analysis);
    }
  }

  /**
   * Generate educational content about crypto concepts
   */
  async generateEducationalContent(topic) {
    try {
      const prompt = this.buildEducationalPrompt(topic);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a crypto educator. Explain complex cryptocurrency concepts in simple, easy-to-understand terms. Use analogies and examples when helpful. Write in English."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.6,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating educational content:', error);
      return this.generateFallbackEducationalContent(topic);
    }
  }

  /**
   * Build prompt for trends summary
   */
  buildTrendsSummaryPrompt(analysis) {
    const topTrends = analysis.topTrends.slice(0, 5).map(trend => 
      `- ${trend.keyword}: ${trend.mentions} mentions, ${trend.sentiment} sentiment, ${trend.trendStrength} strength`
    ).join('\n');

    const hotTopics = analysis.hotTopics.map(topic => 
      `- ${topic.keyword} (strength: ${topic.strength})`
    ).join('\n');

    return `
Analyze these crypto trends and create a Twitter-friendly summary:

Market Sentiment: ${analysis.marketSentiment}
Community Activity: ${analysis.communityBuzz.communityActivity}
Total Mentions: ${analysis.communityBuzz.totalMentions}

Top Trends:
${topTrends}

Hot Topics:
${hotTopics}

Price Movement Indicators:
${analysis.priceMovements.map(m => `- ${m.keyword}: ${m.potentialMovement} (${m.sentiment})`).join('\n')}

Create a concise summary that explains what's happening in crypto markets right now. Include emojis and make it engaging for Twitter users.
    `.trim();
  }

  /**
   * Build prompt for trend explanation
   */
  buildTrendExplanationPrompt(trend) {
    return `
Explain this crypto trend in simple terms:

Keyword: ${trend.keyword}
Category: ${trend.category}
Sentiment: ${trend.sentiment}
Mentions: ${trend.mentions}
Engagement: ${trend.totalEngagement}
Trend Strength: ${trend.trendStrength}

Sample tweets:
${trend.tweets.slice(0, 3).map(tweet => `- "${tweet.text.substring(0, 100)}..."`).join('\n')}

Provide a clear explanation of why this trend is happening and what it means for crypto markets. Keep it educational and accessible.
    `.trim();
  }

  /**
   * Build prompt for sentiment analysis
   */
  buildSentimentAnalysisPrompt(analysis) {
    const sentimentBreakdown = analysis.topTrends.reduce((acc, trend) => {
      acc[trend.sentiment] = (acc[trend.sentiment] || 0) + 1;
      return acc;
    }, {});

    return `
Analyze the current crypto market sentiment:

Overall Sentiment: ${analysis.marketSentiment}
Sentiment Breakdown: ${JSON.stringify(sentimentBreakdown)}
Community Activity: ${analysis.communityBuzz.communityActivity}
Total Engagement: ${analysis.communityBuzz.totalEngagement}

Top trending topics by sentiment:
${analysis.topTrends.slice(0, 10).map(trend => 
  `- ${trend.keyword}: ${trend.sentiment} (${trend.mentions} mentions)`
).join('\n')}

Provide insights about what this sentiment means for crypto markets and what traders should watch for.
    `.trim();
  }

  /**
   * Build prompt for educational content
   */
  buildEducationalPrompt(topic) {
    return `
Create educational content about this crypto topic: ${topic}

Explain:
1. What it is
2. How it works
3. Why it matters
4. Real-world examples or analogies

Make it beginner-friendly but informative. Use simple language and avoid jargon when possible.
    `.trim();
  }

  /**
   * Generate fallback summary when AI fails
   */
  generateFallbackSummary(analysis) {
    const topTrend = analysis.topTrends[0];
    const sentiment = analysis.marketSentiment;
    
    return `📊 Crypto Market Update 📊

Current sentiment: ${sentiment === 'bullish' ? '🟢 Bullish' : sentiment === 'bearish' ? '🔴 Bearish' : '🟡 Neutral'}

Top trend: ${topTrend ? topTrend.keyword : 'N/A'}
Community activity: ${analysis.communityBuzz.communityActivity}

Stay informed about crypto trends! #CryptoAnalysis #MarketUpdate`;
  }

  /**
   * Generate fallback sentiment analysis
   */
  generateFallbackSentimentAnalysis(analysis) {
    const sentiment = analysis.marketSentiment;
    const activity = analysis.communityBuzz.communityActivity;
    
    return `Market sentiment analysis shows ${sentiment} conditions with ${activity} community activity. 
    ${analysis.topTrends.length} trending topics detected. 
    Monitor key indicators for trading opportunities. #CryptoAnalysis`;
  }

  /**
   * Generate fallback educational content
   */
  generateFallbackEducationalContent(topic) {
    const educationalContent = {
      'bitcoin': 'Bitcoin is the first and largest cryptocurrency, often called "digital gold." It operates on a decentralized network using blockchain technology.',
      'ethereum': 'Ethereum is a blockchain platform that enables smart contracts and decentralized applications (dApps). It\'s the foundation for DeFi and NFTs.',
      'defi': 'DeFi (Decentralized Finance) refers to financial services built on blockchain without traditional intermediaries like banks.',
      'nft': 'NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of specific items, often digital art or collectibles.',
      'web3': 'Web3 represents the next generation of the internet, built on blockchain technology with decentralized applications and user ownership.',
    };

    return educationalContent[topic.toLowerCase()] || 
           `${topic} is an important concept in cryptocurrency and blockchain technology. Research thoroughly before investing.`;
  }

  /**
   * Format text for Twitter
   */
  formatForTwitter(text, maxLength = 280) {
    if (text.length <= maxLength) {
      return text;
    }

    // Try to cut at a sentence boundary
    const sentences = text.split(/[.!?]+/);
    let result = '';
    
    for (const sentence of sentences) {
      if ((result + sentence + '.').length <= maxLength - 3) {
        result += sentence + '.';
      } else {
        break;
      }
    }

    if (result.length === 0) {
      result = text.substring(0, maxLength - 3) + '...';
    } else {
      result += '...';
    }

    return result;
  }
}

module.exports = TextGenerationService;
