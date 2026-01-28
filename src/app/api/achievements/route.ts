import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil semua achievements
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

// POST - Tambah achievement baru
export async function POST(request: Request) {
  try {
    const { title, issuer, issued_date, category, credential_url, certificate_url, certificate_type, tags, order } = await request.json();

    if (!title || !issuer || !issued_date || !category || !certificate_url) {
      return NextResponse.json(
        { error: 'Required fields: title, issuer, issued_date, category, certificate_url' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('achievements')
      .insert({
        title,
        issuer,
        issued_date,
        category,
        credential_url: credential_url || null,
        certificate_url,
        certificate_type: certificate_type || 'image',
        tags: tags || [],
        order: order || 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create achievement' },
      { status: 500 }
    );
  }
}

// PUT - Update achievement
export async function PUT(request: Request) {
  try {
    const { id, title, issuer, issued_date, category, credential_url, certificate_url, certificate_type, tags, order } = await request.json();

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
    if (issuer !== undefined) updateData.issuer = issuer;
    if (issued_date !== undefined) updateData.issued_date = issued_date;
    if (category !== undefined) updateData.category = category;
    if (credential_url !== undefined) updateData.credential_url = credential_url;
    if (certificate_url !== undefined) updateData.certificate_url = certificate_url;
    if (certificate_type !== undefined) updateData.certificate_type = certificate_type;
    if (tags !== undefined) updateData.tags = tags;
    if (order !== undefined) updateData.order = order;

    const { data, error } = await supabase
      .from('achievements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update achievement' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus achievement
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
      .from('achievements')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Achievement deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete achievement' },
      { status: 500 }
    );
  }
}

