// One-off script: backfills createdAt on events that predate the TTL index
// (see src/models/Event.js), so the TTL job picks them up and deletes them
// within 24h instead of keeping them forever. Run manually, once, after the
// TTL index is deployed -- this is never run automatically.
//
// Usage:
//   node scripts/backfill-created-at.js            (dry run: prints the
//                                                    target database and how
//                                                    many documents would be
//                                                    changed, changes nothing)
//   node scripts/backfill-created-at.js --yes       (actually performs it)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Event = require('../src/models/Event');

async function main() {
  const confirmed = process.argv.includes('--yes');

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to database:', mongoose.connection.name);

  const missingCount = await Event.countDocuments({ createdAt: { $exists: false } });

  if (!confirmed) {
    console.log(`${missingCount} event(s) are missing createdAt.`);
    console.log('Dry run only -- re-run with --yes to actually backfill them.');
    await mongoose.disconnect();
    return;
  }

  const result = await Event.updateMany(
    { createdAt: { $exists: false } },
    { $set: { createdAt: new Date() } }
  );
  console.log(`Matched ${result.matchedCount}, modified ${result.modifiedCount}.`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
