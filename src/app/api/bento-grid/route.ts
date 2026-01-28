import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil semua images untuk bento grid
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'project' | 'about_me' | null (all)

    let query = supabase
      .from('bento_grid_images')
      .select('*')
      .order('order', { ascending: true });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Jika tidak ada data, return default
    if (!data || data.length === 0) {
      const defaultImages = type === 'about_me' 
        ? [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format",
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format",
            "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=500&auto=format",
            "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format"
          ]
        : [];

      return NextResponse.json({ data: defaultImages.map((url, index) => ({
        id: index + 1,
        type: type || 'project',
        image_url: url,
        order: index + 1
      })) });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bento grid images' },
      { status: 500 }
    );
  }
}

// POST - Tambah image baru
export async function POST(request: Request) {
  try {
    const { type, image_url, order } = await request.json();

    if (!type || !image_url) {
      return NextResponse.json(
        { error: 'Type and image_url are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('bento_grid_images')
      .insert({ type, image_url, order: order || 0 })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create bento grid image' },
      { status: 500 }
    );
  }
}

// PUT - Update image
export async function PUT(request: Request) {
  try {
    const { id, image_url, order, type } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (image_url) updateData.image_url = image_url;
    if (order !== undefined) updateData.order = order;
    if (type) updateData.type = type;

    const { data, error } = await supabase
      .from('bento_grid_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update bento grid image' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus image
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
      .from('bento_grid_images')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete bento grid image' },
      { status: 500 }
    );
  }
}


