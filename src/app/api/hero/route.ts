import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil hero description
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({ 
      data: data || { description: 'Passionate and seasoned Software Engineer with a strong focus on frontend development. Proficient in TypeScript and well-versed in all aspects of web technologies. Proficient in UI UX design with responsive design creation and good experience' }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hero content' },
      { status: 500 }
    );
  }
}

// PUT - Update hero description
export async function PUT(request: Request) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Cek apakah sudah ada data
    const { data: existing } = await supabase
      .from('hero_content')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('hero_content')
        .update({ description, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('hero_content')
        .insert({ description })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update hero content' },
      { status: 500 }
    );
  }
}


