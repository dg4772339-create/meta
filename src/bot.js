const cron = require('node-cron');
const moment = require('moment');
const TwitterService = require('./services/twitterService');
const CryptoAnalysisService = require('./services/cryptoAnalysisService');
const TextGenerationService = require('./services/textGenerationService');
const config = require('./config');

class CryptoTwitterBot {
  constructor() {
    this.twitterService = new TwitterService();
    this.cryptoAnalysisService = new CryptoAnalysisService();
    this.textGenerationService = new TextGenerationService();
    this.isRunning = false;
    this.lastAnalysis = null;
    this.postCount = 0;
    this.maxPostsPerDay = config.rateLimit.tweetRateLimit;
  }

  /**
   * Start the bot
   */
  async start() {
    console.log('🚀 Starting Crypto Twitter Bot...');
    this.isRunning = true;

    // Initial analysis and post
    await this.performAnalysisAndPost();

    // Schedule regular posts
    this.schedulePosts();

    console.log('✅ Bot started successfully!');
    console.log(`📅 Next scheduled post: ${this.getNextPostTime()}`);
  }

  /**
   * Stop the bot
   */
  stop() {
    console.log('🛑 Stopping Crypto Twitter Bot...');
    this.isRunning = false;
    console.log('✅ Bot stopped successfully!');
  }

  /**
   * Schedule regular posts based on configuration
   */
  schedulePosts() {
    const schedule = config.bot.postingSchedule;
    
    cron.schedule(schedule, async () => {
      if (this.isRunning && this.postCount < this.maxPostsPerDay) {
        console.log('⏰ Scheduled post triggered');
        await this.performAnalysisAndPost();
      }
    });

    console.log(`📅 Posts scheduled with cron: ${schedule}`);
  }

  /**
   * Perform analysis and post to Twitter
   */
  async performAnalysisAndPost() {
    try {
      console.log('🔍 Analyzing crypto trends...');
      
      // Get trending topics
      const trendingTopics = await this.twitterService.getTrendingCryptoTopics();
      
      if (!trendingTopics || trendingTopics.length === 0) {
        console.log('⚠️ No trending topics found');
        return;
      }

      // Analyze trends
      const analysis = this.cryptoAnalysisService.analyzeCryptoTrends(trendingTopics);
      this.lastAnalysis = analysis;

      // Generate content
      const content = await this.generatePostContent(analysis);
      
      if (content) {
        // Post to Twitter
        await this.twitterService.postTweet(content);
        this.postCount++;
        
        console.log(`✅ Posted successfully! (${this.postCount}/${this.maxPostsPerDay} today)`);
        console.log('📝 Content:', content.substring(0, 100) + '...');
      }

    } catch (error) {
      console.error('❌ Error in analysis and post:', error);
    }
  }

  /**
   * Generate post content based on analysis
   */
  async generatePostContent(analysis) {
    try {
      // Generate main summary
      const summary = await this.textGenerationService.generateTrendsSummary(analysis);
      
      // Format for Twitter
      const formattedSummary = this.textGenerationService.formatForTwitter(summary);
      
      // Add hashtags
      const hashtags = this.generateRelevantHashtags(analysis);
      const finalContent = `${formattedSummary}\n\n${hashtags}`;
      
      return this.textGenerationService.formatForTwitter(finalContent);
      
    } catch (error) {
      console.error('Error generating post content:', error);
      return this.generateFallbackContent(analysis);
    }
  }

  /**
   * Generate relevant hashtags based on analysis
   */
  generateRelevantHashtags(analysis) {
    const hashtags = ['#CryptoAnalysis', '#CryptoTrends'];
    
    // Add sentiment-based hashtags
    if (analysis.marketSentiment === 'bullish') {
      hashtags.push('#Bullish', '#CryptoBull');
    } else if (analysis.marketSentiment === 'bearish') {
      hashtags.push('#Bearish', '#CryptoBear');
    } else {
      hashtags.push('#Neutral', '#CryptoMarket');
    }

    // Add top trending hashtags
    const topTrends = analysis.topTrends.slice(0, 3);
    topTrends.forEach(trend => {
      if (trend.keyword.startsWith('#')) {
        hashtags.push(trend.keyword);
      } else {
        hashtags.push(`#${trend.keyword.replace('#', '')}`);
      }
    });

    // Add category-specific hashtags
    const categories = [...new Set(analysis.topTrends.map(t => t.category))];
    categories.forEach(category => {
      switch (category) {
        case 'bitcoin':
          hashtags.push('#Bitcoin', '#BTC');
          break;
        case 'ethereum':
          hashtags.push('#Ethereum', '#ETH');
          break;
        case 'defi':
          hashtags.push('#DeFi');
          break;
        case 'nft':
          hashtags.push('#NFT', '#NFTs');
          break;
        case 'web3':
          hashtags.push('#Web3');
          break;
      }
    });

    // Remove duplicates and limit to reasonable number
    const uniqueHashtags = [...new Set(hashtags)].slice(0, 8);
    
    return uniqueHashtags.join(' ');
  }

  /**
   * Generate fallback content when AI generation fails
   */
  generateFallbackContent(analysis) {
    const topTrend = analysis.topTrends[0];
    const sentiment = analysis.marketSentiment;
    
    let content = `📊 Crypto Market Update 📊\n\n`;
    content += `Market Sentiment: ${sentiment === 'bullish' ? '🟢 Bullish' : sentiment === 'bearish' ? '🔴 Bearish' : '🟡 Neutral'}\n\n`;
    
    if (topTrend) {
      content += `Top Trend: ${topTrend.keyword}\n`;
      content += `Mentions: ${topTrend.mentions}\n`;
      content += `Sentiment: ${topTrend.sentiment}\n\n`;
    }
    
    content += `Community Activity: ${analysis.communityBuzz.communityActivity}\n`;
    content += `Total Mentions: ${analysis.communityBuzz.totalMentions}\n\n`;
    
    content += `Stay informed about crypto trends! #CryptoAnalysis #CryptoTrends`;
    
    return content;
  }

  /**
   * Get next scheduled post time
   */
  getNextPostTime() {
    const schedule = config.bot.postingSchedule;
    // This is a simplified calculation - in production you'd want more sophisticated scheduling
    const now = moment();
    const nextHour = now.clone().add(6, 'hours').format('YYYY-MM-DD HH:mm:ss');
    return nextHour;
  }

  /**
   * Get bot status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      postCount: this.postCount,
      maxPostsPerDay: this.maxPostsPerDay,
      lastAnalysis: this.lastAnalysis ? this.lastAnalysis.timestamp : null,
      nextPostTime: this.getNextPostTime(),
    };
  }

  /**
   * Force a manual analysis and post
   */
  async forcePost() {
    console.log('🔄 Manual post triggered');
    await this.performAnalysisAndPost();
  }

  /**
   * Get detailed analysis report
   */
  async getAnalysisReport() {
    if (!this.lastAnalysis) {
      return null;
    }

    const insights = this.cryptoAnalysisService.generateSummaryInsights(this.lastAnalysis);
    
    return {
      timestamp: this.lastAnalysis.timestamp,
      marketSentiment: this.lastAnalysis.marketSentiment,
      topTrends: this.lastAnalysis.topTrends.slice(0, 10),
      hotTopics: this.lastAnalysis.hotTopics,
      priceMovements: this.lastAnalysis.priceMovements,
      communityBuzz: this.lastAnalysis.communityBuzz,
      insights: insights,
    };
  }

  /**
   * Reset daily post counter (call this at midnight)
   */
  resetDailyCounter() {
    this.postCount = 0;
    console.log('🔄 Daily post counter reset');
  }

  /**
   * Handle graceful shutdown
   */
  async shutdown() {
    console.log('🛑 Shutting down bot gracefully...');
    this.stop();
    process.exit(0);
  }
}

module.exports = CryptoTwitterBot;
