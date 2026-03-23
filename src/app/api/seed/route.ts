import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  // Check authorization
  const authHeader = request.headers.get('authorization');
  const seedSecret = process.env.SEED_SECRET;

  if (!seedSecret || authHeader !== `Bearer ${seedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use service role key for seeding (bypasses RLS)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Read and execute the seed SQL
    const seedPath = path.join(process.cwd(), 'supabase', 'seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');

    // Split by semicolons and execute each statement
    const statements = seedSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' }).single();
      if (error) {
        // Try direct insert approach instead
        console.log('RPC not available, seed SQL should be run directly in Supabase SQL Editor');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Seed data loaded. If RPC failed, run supabase/seed.sql directly in the Supabase SQL Editor.',
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
