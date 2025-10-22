const { TwitterApi } = require('twitter-api-v2');
const config = require('./config');

class TwitterService {
  constructor() {
    this.client = new TwitterApi({
      appKey: config.twitter.apiKey,
      appSecret: config.twitter.apiSecret,
      accessToken: config.twitter.accessToken,
      accessSecret: config.twitter.accessTokenSecret,
    });
    
    this.readOnlyClient = new TwitterApi(config.twitter.bearerToken);
  }

  /**
   * Get trending crypto-related hashtags and topics
   */
  async getTrendingCryptoTopics() {
    try {
      // Search for crypto-related tweets
      const cryptoKeywords = [
        '#bitcoin', '#btc', '#ethereum', '#eth', '#crypto', '#cryptocurrency',
        '#defi', '#nft', '#web3', '#blockchain', '#altcoin', '#trading',
        '#hodl', '#bullish', '#bearish', '#pump', '#dump', '#moon'
      ];

      const trendingTopics = [];
      
      for (const keyword of cryptoKeywords) {
        try {
          const tweets = await this.readOnlyClient.v2.search(keyword, {
            max_results: 100,
            'tweet.fields': ['created_at', 'public_metrics', 'context_annotations'],
            'user.fields': ['verified', 'public_metrics'],
            expansions: ['author_id'],
          });

          if (tweets.data) {
            tweets.data.forEach(tweet => {
              trendingTopics.push({
                keyword,
                text: tweet.text,
                createdAt: tweet.created_at,
                metrics: tweet.public_metrics,
                authorId: tweet.author_id,
              });
            });
          }

          // Rate limiting
          await this.delay(config.rateLimit.apiCallDelay);
        } catch (error) {
          console.error(`Error searching for ${keyword}:`, error.message);
        }
      }

      return this.analyzeTrendingTopics(trendingTopics);
    } catch (error) {
      console.error('Error getting trending crypto topics:', error);
      throw error;
    }
  }

  /**
   * Analyze and rank trending topics by engagement
   */
  analyzeTrendingTopics(topics) {
    const topicAnalysis = {};

    topics.forEach(topic => {
      const key = topic.keyword.toLowerCase();
      if (!topicAnalysis[key]) {
        topicAnalysis[key] = {
          keyword: key,
          mentions: 0,
          totalEngagement: 0,
          avgEngagement: 0,
          tweets: [],
          sentiment: 'neutral',
        };
      }

      topicAnalysis[key].mentions++;
      topicAnalysis[key].totalEngagement += 
        topic.metrics.like_count + 
        topic.metrics.retweet_count + 
        topic.metrics.reply_count;
      topicAnalysis[key].tweets.push(topic);
    });

    // Calculate average engagement and sort by popularity
    Object.values(topicAnalysis).forEach(topic => {
      topic.avgEngagement = topic.totalEngagement / topic.mentions;
    });

    return Object.values(topicAnalysis)
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, config.crypto.trendingHashtagsLimit);
  }

  /**
   * Post a tweet
   */
  async postTweet(text) {
    try {
      if (text.length > config.bot.maxTweetLength) {
        text = text.substring(0, config.bot.maxTweetLength - 3) + '...';
      }

      const tweet = await this.client.v2.tweet(text);
      console.log('Tweet posted successfully:', tweet.data.id);
      return tweet;
    } catch (error) {
      console.error('Error posting tweet:', error);
      throw error;
    }
  }

  /**
   * Get user timeline
   */
  async getUserTimeline(userId, maxResults = 10) {
    try {
      const timeline = await this.readOnlyClient.v2.userTimeline(userId, {
        max_results: maxResults,
        'tweet.fields': ['created_at', 'public_metrics'],
      });
      return timeline.data;
    } catch (error) {
      console.error('Error getting user timeline:', error);
      throw error;
    }
  }

  /**
   * Search for specific crypto terms
   */
  async searchCryptoTerm(term, maxResults = 50) {
    try {
      const searchResults = await this.readOnlyClient.v2.search(term, {
        max_results: maxResults,
        'tweet.fields': ['created_at', 'public_metrics', 'context_annotations'],
        'user.fields': ['verified', 'public_metrics'],
        expansions: ['author_id'],
      });
      return searchResults;
    } catch (error) {
      console.error(`Error searching for ${term}:`, error);
      throw error;
    }
  }

  /**
   * Utility function for delays
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = TwitterService;
