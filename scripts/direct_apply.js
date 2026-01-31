const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const dbPassword = 'QpJIzi2r6vaoghG5';
const projectRef = 'qvslbiceoonrgjxzkotb';
const dbUrl = `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;

const migrationFile = path.join(__dirname, '..', 'supabase', 'migrations', '20260131000001_phase1_rpcs.sql');

async function apply() {
  console.log(`🔌 Connecting to database...`);
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false } // Required for Supabase in some envs, or generally safe for this tool
  });

  try {
    await client.connect();
    console.log(`✅ Connected.`);

    console.log(`📖 Reading migration file: ${path.basename(migrationFile)}`);
    const sql = fs.readFileSync(migrationFile, 'utf8');

    console.log(`🚀 Executing SQL...`);
    await client.query(sql);
    
    console.log(`✨ Migration applied successfully!`);
  } catch (err) {
    console.error(`❌ Error applying migration:`, err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

apply();
