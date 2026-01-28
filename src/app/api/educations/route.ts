import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil semua educations
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('educations')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch educations' },
      { status: 500 }
    );
  }
}

// POST - Tambah education baru
export async function POST(request: Request) {
  try {
    const { institution, degree, major, degree_code, start_year, end_year, duration, location, logo, logo_url, order } = await request.json();

    if (!institution || !degree || !major || !start_year || !duration || !location) {
      return NextResponse.json(
        { error: 'Required fields: institution, degree, major, start_year, duration, location' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('educations')
      .insert({
        institution,
        degree,
        major,
        degree_code: degree_code || null,
        start_year,
        end_year: end_year || null,
        duration,
        location,
        logo: logo || '🎓',
        logo_url: logo_url || null,
        order: order || 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create education' },
      { status: 500 }
    );
  }
}

// PUT - Update education
export async function PUT(request: Request) {
  try {
    const { id, institution, degree, major, degree_code, start_year, end_year, duration, location, logo, logo_url, order } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (institution !== undefined) updateData.institution = institution;
    if (degree !== undefined) updateData.degree = degree;
    if (major !== undefined) updateData.major = major;
    if (degree_code !== undefined) updateData.degree_code = degree_code;
    if (start_year !== undefined) updateData.start_year = start_year;
    if (end_year !== undefined) updateData.end_year = end_year;
    if (duration !== undefined) updateData.duration = duration;
    if (location !== undefined) updateData.location = location;
    if (logo !== undefined) updateData.logo = logo;
    if (logo_url !== undefined) updateData.logo_url = logo_url;
    if (order !== undefined) updateData.order = order;

    const { data, error } = await supabase
      .from('educations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update education' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus education
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
      .from('educations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Education deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete education' },
      { status: 500 }
    );
  }
}


