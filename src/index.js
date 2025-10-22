const BotManager = require('./manager');

// Main entry point
async function main() {
  const manager = new BotManager();
  await manager.start();
}

// Run the bot
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
