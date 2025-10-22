const moment = require('moment');
const _ = require('lodash');

class CryptoAnalysisService {
  constructor() {
    this.cryptoKeywords = {
      bitcoin: ['bitcoin', 'btc', '#bitcoin', '#btc'],
      ethereum: ['ethereum', 'eth', '#ethereum', '#eth'],
      defi: ['defi', 'decentralized finance', '#defi'],
      nft: ['nft', 'non-fungible token', '#nft', '#nfts'],
      web3: ['web3', 'web 3.0', '#web3'],
      altcoin: ['altcoin', 'alt', 'alternative coin'],
      trading: ['trading', 'trade', 'buy', 'sell', 'hodl'],
      market: ['bullish', 'bearish', 'pump', 'dump', 'moon', 'crash'],
    };

    this.sentimentKeywords = {
      positive: ['bullish', 'moon', 'pump', 'buy', 'hodl', 'diamond hands', 'to the moon'],
      negative: ['bearish', 'dump', 'sell', 'crash', 'fud', 'panic'],
      neutral: ['analysis', 'technical', 'fundamental', 'chart', 'price'],
    };
  }

  /**
   * Analyze crypto trends from Twitter data
   */
  analyzeCryptoTrends(trendingTopics) {
    const analysis = {
      topTrends: [],
      marketSentiment: 'neutral',
      hotTopics: [],
      priceMovements: [],
      communityBuzz: [],
      timestamp: moment().toISOString(),
    };

    // Process each trending topic
    trendingTopics.forEach(topic => {
      const trendAnalysis = this.analyzeTrend(topic);
      analysis.topTrends.push(trendAnalysis);
    });

    // Determine overall market sentiment
    analysis.marketSentiment = this.calculateMarketSentiment(analysis.topTrends);

    // Extract hot topics
    analysis.hotTopics = this.extractHotTopics(analysis.topTrends);

    // Identify potential price movements
    analysis.priceMovements = this.identifyPriceMovements(analysis.topTrends);

    // Analyze community buzz
    analysis.communityBuzz = this.analyzeCommunityBuzz(analysis.topTrends);

    return analysis;
  }

  /**
   * Analyze individual trend
   */
  analyzeTrend(topic) {
    const trend = {
      keyword: topic.keyword,
      mentions: topic.mentions,
      engagement: topic.totalEngagement,
      avgEngagement: topic.avgEngagement,
      sentiment: this.analyzeSentiment(topic.tweets),
      category: this.categorizeKeyword(topic.keyword),
      tweets: topic.tweets.slice(0, 5), // Keep only top 5 tweets
      trendStrength: this.calculateTrendStrength(topic),
      explanation: this.generateTrendExplanation(topic),
    };

    return trend;
  }

  /**
   * Analyze sentiment from tweets
   */
  analyzeSentiment(tweets) {
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    tweets.forEach(tweet => {
      const text = tweet.text.toLowerCase();
      
      // Check for positive sentiment
      if (this.sentimentKeywords.positive.some(keyword => text.includes(keyword))) {
        positiveCount++;
      }
      // Check for negative sentiment
      else if (this.sentimentKeywords.negative.some(keyword => text.includes(keyword))) {
        negativeCount++;
      }
      else {
        neutralCount++;
      }
    });

    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      return 'positive';
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  /**
   * Categorize crypto keyword
   */
  categorizeKeyword(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    
    for (const [category, keywords] of Object.entries(this.cryptoKeywords)) {
      if (keywords.some(k => lowerKeyword.includes(k))) {
        return category;
      }
    }
    
    return 'general';
  }

  /**
   * Calculate trend strength based on engagement and mentions
   */
  calculateTrendStrength(topic) {
    const engagementScore = Math.log(topic.totalEngagement + 1);
    const mentionScore = Math.log(topic.mentions + 1);
    const avgEngagementScore = topic.avgEngagement;
    
    return Math.round((engagementScore + mentionScore + avgEngagementScore) / 3);
  }

  /**
   * Generate explanation for trend
   */
  generateTrendExplanation(topic) {
    const category = this.categorizeKeyword(topic.keyword);
    const sentiment = this.analyzeSentiment(topic.tweets);
    
    let explanation = `${topic.keyword} is trending with ${topic.mentions} mentions and ${topic.totalEngagement} total engagement. `;
    
    switch (category) {
      case 'bitcoin':
        explanation += sentiment === 'positive' 
          ? 'Bitcoin is showing bullish momentum with strong community support.'
          : sentiment === 'negative'
          ? 'Bitcoin is facing bearish pressure with negative sentiment.'
          : 'Bitcoin discussion is neutral with mixed market opinions.';
        break;
      case 'ethereum':
        explanation += sentiment === 'positive'
          ? 'Ethereum is gaining positive attention, possibly due to network upgrades or DeFi activity.'
          : sentiment === 'negative'
          ? 'Ethereum is experiencing negative sentiment, possibly due to gas fees or network issues.'
          : 'Ethereum discussion is neutral with balanced market views.';
        break;
      case 'defi':
        explanation += sentiment === 'positive'
          ? 'DeFi protocols are attracting positive attention with increased activity.'
          : sentiment === 'negative'
          ? 'DeFi sector is facing challenges with negative sentiment.'
          : 'DeFi discussion is neutral with mixed protocol performance.';
        break;
      case 'nft':
        explanation += sentiment === 'positive'
          ? 'NFT market is showing positive momentum with new projects gaining traction.'
          : sentiment === 'negative'
          ? 'NFT market is facing headwinds with declining interest.'
          : 'NFT discussion is neutral with varied project performance.';
        break;
      case 'trading':
        explanation += sentiment === 'positive'
          ? 'Trading sentiment is bullish with increased buying pressure.'
          : sentiment === 'negative'
          ? 'Trading sentiment is bearish with selling pressure.'
          : 'Trading discussion is neutral with mixed market signals.';
        break;
      default:
        explanation += sentiment === 'positive'
          ? 'This crypto topic is generating positive buzz in the community.'
          : sentiment === 'negative'
          ? 'This crypto topic is facing negative sentiment.'
          : 'This crypto topic has neutral community sentiment.';
    }
    
    return explanation;
  }

  /**
   * Calculate overall market sentiment
   */
  calculateMarketSentiment(trends) {
    const sentiments = trends.map(trend => trend.sentiment);
    const positiveCount = sentiments.filter(s => s === 'positive').length;
    const negativeCount = sentiments.filter(s => s === 'negative').length;
    const neutralCount = sentiments.filter(s => s === 'neutral').length;
    
    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      return 'bullish';
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      return 'bearish';
    } else {
      return 'neutral';
    }
  }

  /**
   * Extract hot topics with high engagement
   */
  extractHotTopics(trends) {
    return trends
      .filter(trend => trend.trendStrength > 50)
      .sort((a, b) => b.trendStrength - a.trendStrength)
      .slice(0, 5)
      .map(trend => ({
        keyword: trend.keyword,
        strength: trend.trendStrength,
        sentiment: trend.sentiment,
        explanation: trend.explanation,
      }));
  }

  /**
   * Identify potential price movements
   */
  identifyPriceMovements(trends) {
    const priceRelatedTrends = trends.filter(trend => 
      trend.category === 'trading' || 
      trend.category === 'market' ||
      trend.keyword.includes('price') ||
      trend.keyword.includes('pump') ||
      trend.keyword.includes('dump')
    );

    return priceRelatedTrends.map(trend => ({
      keyword: trend.keyword,
      sentiment: trend.sentiment,
      strength: trend.trendStrength,
      potentialMovement: trend.sentiment === 'positive' ? 'upward' : 
                        trend.sentiment === 'negative' ? 'downward' : 'sideways',
    }));
  }

  /**
   * Analyze community buzz and engagement patterns
   */
  analyzeCommunityBuzz(trends) {
    const buzzAnalysis = {
      totalMentions: trends.reduce((sum, trend) => sum + trend.mentions, 0),
      totalEngagement: trends.reduce((sum, trend) => sum + trend.engagement, 0),
      avgEngagementPerMention: 0,
      mostEngagingTopic: null,
      communityActivity: 'moderate',
    };

    buzzAnalysis.avgEngagementPerMention = buzzAnalysis.totalEngagement / buzzAnalysis.totalMentions;
    buzzAnalysis.mostEngagingTopic = trends.reduce((max, trend) => 
      trend.avgEngagement > max.avgEngagement ? trend : max, trends[0]);

    // Determine community activity level
    if (buzzAnalysis.totalMentions > 1000) {
      buzzAnalysis.communityActivity = 'high';
    } else if (buzzAnalysis.totalMentions < 100) {
      buzzAnalysis.communityActivity = 'low';
    }

    return buzzAnalysis;
  }

  /**
   * Generate summary insights
   */
  generateSummaryInsights(analysis) {
    const insights = [];

    // Market sentiment insight
    insights.push(`Market sentiment is ${analysis.marketSentiment} based on trending topics analysis.`);

    // Hot topics insight
    if (analysis.hotTopics.length > 0) {
      const topTopic = analysis.hotTopics[0];
      insights.push(`${topTopic.keyword} is the hottest topic with ${topTopic.strength} trend strength.`);
    }

    // Price movement insight
    if (analysis.priceMovements.length > 0) {
      const bullishMovements = analysis.priceMovements.filter(m => m.sentiment === 'positive').length;
      const bearishMovements = analysis.priceMovements.filter(m => m.sentiment === 'negative').length;
      
      if (bullishMovements > bearishMovements) {
        insights.push('Price movement indicators suggest upward momentum.');
      } else if (bearishMovements > bullishMovements) {
        insights.push('Price movement indicators suggest downward pressure.');
      }
    }

    // Community activity insight
    insights.push(`Community activity is ${analysis.communityBuzz.communityActivity} with ${analysis.communityBuzz.totalMentions} total mentions.`);

    return insights;
  }
}

module.exports = CryptoAnalysisService;
