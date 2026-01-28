import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil semua contact links
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('contact_links')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contact links' },
      { status: 500 }
    );
  }
}

// POST - Tambah contact link baru
export async function POST(request: Request) {
  try {
    const { title, description, button_text, url, icon_name, icon_type, gradient, bg_color, order } = await request.json();

    // Hanya field penting yang required, gradient dan bg_color optional
    if (!title || !description || !button_text || !url || !icon_name || !icon_type) {
      return NextResponse.json(
        { error: 'Title, description, button_text, url, icon_name, and icon_type are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('contact_links')
      .insert({
        title,
        description,
        button_text,
        url,
        icon_name,
        icon_type,
        gradient: gradient || null,
        bg_color: bg_color || null,
        order: order || 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create contact link' },
      { status: 500 }
    );
  }
}

// PUT - Update contact link
export async function PUT(request: Request) {
  try {
    const { id, title, description, button_text, url, icon_name, icon_type, gradient, bg_color, order } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (button_text !== undefined) updateData.button_text = button_text;
    if (url !== undefined) updateData.url = url;
    if (icon_name !== undefined) updateData.icon_name = icon_name;
    if (icon_type !== undefined) updateData.icon_type = icon_type;
    if (gradient !== undefined) updateData.gradient = gradient;
    if (bg_color !== undefined) updateData.bg_color = bg_color;
    if (order !== undefined) updateData.order = order;

    const { data, error } = await supabase
      .from('contact_links')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update contact link' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus contact link
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
      .from('contact_links')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Contact link deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete contact link' },
      { status: 500 }
    );
  }
}

