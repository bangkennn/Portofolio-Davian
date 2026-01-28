import { NextResponse } from 'next/server';

// Route handler untuk menerima data dari frontend
// Email akan dikirim melalui EmailJS dari sisi client
export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validasi input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Return success response
    // Email sending dilakukan di client-side menggunakan EmailJS
    return NextResponse.json(
      {
        success: true,
        message: 'Data berhasil diterima!',
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      {
        error: 'Gagal memproses permintaan. Silakan coba lagi.',
        details: error.message
      },
      { status: 500 }
    );
  }
}
