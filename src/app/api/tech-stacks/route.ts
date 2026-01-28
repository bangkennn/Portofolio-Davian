import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil semua tech stacks
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tech_stacks')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tech stacks' },
      { status: 500 }
    );
  }
}

// POST - Tambah tech stack baru
export async function POST(request: Request) {
  try {
    const { name, icon_name, color } = await request.json();

    if (!name || !icon_name || !color) {
      return NextResponse.json(
        { error: 'Required fields: name, icon_name, color' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tech_stacks')
      .insert({ name, icon_name, color })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create tech stack' },
      { status: 500 }
    );
  }
}

// PUT - Update tech stack
export async function PUT(request: Request) {
  try {
    const { id, name, icon_name, color } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (icon_name !== undefined) updateData.icon_name = icon_name;
    if (color !== undefined) updateData.color = color;

    const { data, error } = await supabase
      .from('tech_stacks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update tech stack' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus tech stack
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('tech_stacks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Tech stack deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete tech stack' },
      { status: 500 }
    );
  }
}

