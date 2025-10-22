const CryptoTwitterBot = require('./bot');
const config = require('./config');

class BotManager {
  constructor() {
    this.bot = new CryptoTwitterBot();
    this.setupSignalHandlers();
  }

  /**
   * Start the bot manager
   */
  async start() {
    try {
      console.log('🎯 Crypto Twitter Bot Manager Starting...');
      console.log('📋 Configuration:');
      console.log(`   - Bot Username: ${config.bot.username}`);
      console.log(`   - Posting Schedule: ${config.bot.postingSchedule}`);
      console.log(`   - Max Posts/Day: ${config.rateLimit.tweetRateLimit}`);
      console.log(`   - Analysis Window: ${config.crypto.analysisTimeWindow}h`);
      console.log('');

      await this.bot.start();
      
      // Set up daily counter reset at midnight
      this.scheduleDailyReset();
      
      console.log('🎉 Bot Manager started successfully!');
      console.log('💡 Use Ctrl+C to stop the bot gracefully');
      
    } catch (error) {
      console.error('❌ Failed to start bot manager:', error);
      process.exit(1);
    }
  }

  /**
   * Stop the bot manager
   */
  async stop() {
    try {
      console.log('🛑 Stopping Bot Manager...');
      await this.bot.shutdown();
    } catch (error) {
      console.error('❌ Error stopping bot manager:', error);
      process.exit(1);
    }
  }

  /**
   * Setup signal handlers for graceful shutdown
   */
  setupSignalHandlers() {
    process.on('SIGINT', async () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      await this.stop();
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      await this.stop();
    });

    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      this.stop();
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      this.stop();
    });
  }

  /**
   * Schedule daily counter reset
   */
  scheduleDailyReset() {
    const cron = require('node-cron');
    
    // Reset counter at midnight every day
    cron.schedule('0 0 * * *', () => {
      this.bot.resetDailyCounter();
    });

    console.log('📅 Daily counter reset scheduled for midnight');
  }

  /**
   * Get bot status
   */
  getStatus() {
    return this.bot.getStatus();
  }

  /**
   * Force a manual post
   */
  async forcePost() {
    await this.bot.forcePost();
  }

  /**
   * Get analysis report
   */
  async getAnalysisReport() {
    return await this.bot.getAnalysisReport();
  }
}

// CLI Interface
if (require.main === module) {
  const manager = new BotManager();
  
  // Handle command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--status')) {
    console.log('📊 Bot Status:', JSON.stringify(manager.getStatus(), null, 2));
    process.exit(0);
  }
  
  if (args.includes('--force-post')) {
    manager.start().then(async () => {
      await manager.forcePost();
      await manager.stop();
    });
  } else if (args.includes('--report')) {
    manager.start().then(async () => {
      const report = await manager.getAnalysisReport();
      console.log('📈 Analysis Report:', JSON.stringify(report, null, 2));
      await manager.stop();
    });
  } else {
    // Normal startup
    manager.start();
  }
}

module.exports = BotManager;
