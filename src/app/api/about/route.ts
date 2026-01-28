import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil deskripsi About
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      // Jika tidak ada data, return default
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          data: {
            id: 1,
            description: 'Salam hangat,\n\nSaya Davian Putra Swardana, seorang mahasiswa Sistem Informasi di Universitas Jambi dan seorang Fullstack Developer yang memiliki passion dalam membangun produk software yang impactful.\n\nDalam pengembangan web, saya menggunakan teknologi modern seperti Next.js, TypeScript, dan Tailwind CSS untuk frontend, serta Golang untuk backend development. Untuk aplikasi mobile, saya mengembangkan aplikasi Android native menggunakan Kotlin.\n\nSaya percaya bahwa pengembangan software yang baik adalah tentang menciptakan solusi yang user-friendly dengan performa tinggi. Saya selalu fokus pada efisiensi dan kejelasan, baik dalam interface yang intuitif maupun dalam backend services yang robust.\n\nSebagai seorang fast learner, saya senang bekerja dalam lingkungan yang dinamis dan menantang. Saya percaya bahwa komunikasi yang baik dan sinergi tim adalah kunci kesuksesan dalam pengembangan software.\n\nPengalaman saya telah membentuk kemampuan teknis, analitis, dan leadership saya. Saya selalu bersemangat untuk bekerja dalam tim, belajar dari orang lain, dan berkontribusi pada proyek-proyek yang impactful.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        });
      }
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch about content' },
      { status: 500 }
    );
  }
}

// PUT - Update deskripsi About
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
      .from('about_content')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('about_content')
        .update({ description, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('about_content')
        .insert({ description })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update about content' },
      { status: 500 }
    );
  }
}


