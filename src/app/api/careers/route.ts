import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil semua careers
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch careers' },
      { status: 500 }
    );
  }
}

// POST - Tambah career baru
export async function POST(request: Request) {
  try {
    const { title, company, location, start_date, end_date, duration, months, type, work_type, logo, logo_url, responsibilities, order } = await request.json();

    if (!title || !company || !location || !start_date || !duration || !months || !type || !work_type) {
      return NextResponse.json(
        { error: 'Required fields: title, company, location, start_date, duration, months, type, work_type' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('careers')
      .insert({
        title,
        company,
        location,
        start_date,
        end_date: end_date || null,
        duration,
        months,
        type,
        work_type,
        logo: logo || '🟢',
        logo_url: logo_url || null,
        responsibilities: responsibilities || null,
        order: order || 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create career' },
      { status: 500 }
    );
  }
}

// PUT - Update career
export async function PUT(request: Request) {
  try {
    const { id, title, company, location, start_date, end_date, duration, months, type, work_type, logo, logo_url, responsibilities, order } = await request.json();

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
    if (company !== undefined) updateData.company = company;
    if (location !== undefined) updateData.location = location;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (end_date !== undefined) updateData.end_date = end_date;
    if (duration !== undefined) updateData.duration = duration;
    if (months !== undefined) updateData.months = months;
    if (type !== undefined) updateData.type = type;
    if (work_type !== undefined) updateData.work_type = work_type;
    if (logo !== undefined) updateData.logo = logo;
    if (logo_url !== undefined) updateData.logo_url = logo_url;
    if (responsibilities !== undefined) updateData.responsibilities = responsibilities;
    if (order !== undefined) updateData.order = order;

    const { data, error } = await supabase
      .from('careers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update career' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus career
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
      .from('careers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Career deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete career' },
      { status: 500 }
    );
  }
}


