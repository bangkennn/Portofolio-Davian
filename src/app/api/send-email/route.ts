import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

        // Kirim email menggunakan Resend
        const data = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>', // Resend default email
            to: ['bangkennn29@gmail.com'],
            replyTo: email, // Email pengirim sebagai reply-to
            subject: `Pesan Baru dari ${name} - Portfolio Contact`,
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border: 1px solid #e5e7eb;
              }
              .info-box {
                background: white;
                padding: 15px;
                margin: 10px 0;
                border-left: 4px solid #10b981;
                border-radius: 4px;
              }
              .label {
                font-weight: bold;
                color: #059669;
                margin-bottom: 5px;
              }
              .message-box {
                background: white;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
              }
              .footer {
                background: #1f2937;
                color: #9ca3af;
                padding: 20px;
                border-radius: 0 0 10px 10px;
                text-align: center;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">📧 Pesan Baru dari Portfolio</h1>
            </div>
            
            <div class="content">
              <p>Hai! Anda mendapat pesan baru dari website portfolio Anda:</p>
              
              <div class="info-box">
                <div class="label">👤 Nama:</div>
                <div>${name}</div>
              </div>
              
              <div class="info-box">
                <div class="label">📧 Email:</div>
                <div><a href="mailto:${email}" style="color: #059669;">${email}</a></div>
              </div>
              
              <div class="message-box">
                <div class="label" style="margin-bottom: 10px;">💬 Pesan:</div>
                <div style="white-space: pre-wrap;">${message}</div>
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <strong>💡 Tips:</strong> Anda bisa langsung membalas email ini dengan klik tombol "Reply" pada email client Anda.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">Email ini dikirim otomatis dari form contact di website portfolio Anda</p>
              <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} - Portfolio Contact System</p>
            </div>
          </body>
        </html>
      `,
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Email berhasil dikirim!',
                data
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            {
                error: 'Gagal mengirim email. Silakan coba lagi.',
                details: error.message
            },
            { status: 500 }
        );
    }
}
