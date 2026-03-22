import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateStatus } from '@/lib/utils';

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

// GET /api/releases/[id] - Get a single release
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const error = checkSupabase();
  if (error) return error;

  try {
    const { id } = await params;
    const { data, error } = await supabase!
      .from('releases')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/releases/[id] - Update a release
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const error = checkSupabase();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { additional_info, completed_steps, toggle_step } = body;

    // Get current release
    const { data: current, error: fetchError } = await supabase!
      .from('releases')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    let newCompletedSteps = current.completed_steps || [];

    // Handle toggling a single step
    if (toggle_step) {
      const index = newCompletedSteps.indexOf(toggle_step);
      if (index > -1) {
        newCompletedSteps.splice(index, 1);
      } else {
        newCompletedSteps.push(toggle_step);
      }
    } else if (completed_steps !== undefined) {
      newCompletedSteps = completed_steps;
    }

    // Calculate new status based on completed steps
    const newStatus = calculateStatus(newCompletedSteps);

    const updateData = {
      ...(additional_info !== undefined && { additional_info }),
      completed_steps: newCompletedSteps,
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase!
      .from('releases')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

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

// DELETE /api/releases/[id] - Delete a release
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const error = checkSupabase();
  if (error) return error;

  try {
    const { id } = await params;
    const { error } = await supabase!
      .from('releases')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
