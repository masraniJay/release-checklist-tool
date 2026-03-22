import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateStatus } from '@/lib/utils';
import { RELEASE_STEPS } from '@/types/release';

// Helper function to check Supabase connection
function checkSupabase() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.' },
      { status: 500 }
    );
  }
  return null;
}

// GET /api/releases - List all releases
export async function GET() {
  const error = checkSupabase();
  if (error) return error;

  try {
    const { data, error } = await supabase!
      .from('releases')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/releases - Create a new release
export async function POST(request: NextRequest) {
  const error = checkSupabase();
  if (error) return error;

  try {
    const body = await request.json();
    const { name, date, additional_info } = body;

    // Validation
    if (!name || !date) {
      return NextResponse.json(
        { error: 'Name and date are required' },
        { status: 400 }
      );
    }

    // Create release with empty completed steps (status: planned)
    const newRelease = {
      name,
      date: new Date(date).toISOString(),
      additional_info: additional_info || null,
      completed_steps: [],
      status: 'planned',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase!
      .from('releases')
      .insert(newRelease)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
