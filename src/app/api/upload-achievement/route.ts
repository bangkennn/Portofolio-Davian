import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const isPDF = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');

    if (!isPDF && !isImage) {
      return NextResponse.json(
        { error: 'File must be an image (PNG/JPG) or PDF' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for PDF, 5MB for image)
    const maxSize = isPDF ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size must be less than ${isPDF ? '10MB' : '5MB'}` },
        { status: 400 }
      );
    }

    let imageBuffer: Buffer;
    let contentType: string;
    let fileName: string;

    if (isPDF) {
      // Extract thumbnail from PDF first page using pdfjs-dist
      try {
        // Import pdfjs-dist using require for better Node.js compatibility
        const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
        
        // Disable worker for server-side
        pdfjsLib.GlobalWorkerOptions.workerSrc = false;
        
        // Read PDF file
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({ 
          data: uint8Array,
          useSystemFonts: true,
          verbosity: 0,
        });
        const pdf = await loadingTask.promise;
        
        // Get first page
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });

        // Use canvas for rendering
        const { createCanvas } = require('canvas');
        const canvas = createCanvas(Math.floor(viewport.width), Math.floor(viewport.height));
        const context = canvas.getContext('2d');

        // Render PDF page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;

        // Convert canvas to PNG buffer
        imageBuffer = canvas.toBuffer('image/png');
        contentType = 'image/png';
        fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
      } catch (pdfError: any) {
        console.error('PDF processing error:', pdfError);
        console.error('Error name:', pdfError.name);
        console.error('Error message:', pdfError.message);
        console.error('Error stack:', pdfError.stack);
        return NextResponse.json(
          { 
            error: 'Failed to process PDF. PDF thumbnail extraction failed.',
            details: pdfError.message || String(pdfError),
            errorName: pdfError.name,
            hint: 'Pastikan pdfjs-dist dan canvas sudah terinstall dengan benar. Jalankan: npm install pdfjs-dist canvas'
          },
          { status: 500 }
        );
      }
    } else {
      // Handle image upload directly
      const arrayBuffer = await file.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
      contentType = file.type;
      const fileExt = file.name.split('.').pop();
      fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    }

    // Upload to Supabase Storage
    const folder = 'achievements';
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, imageBuffer, {
        contentType: contentType,
        upsert: false,
      });

    if (error) {
      console.error('Supabase Storage error:', error);
      if (error.message?.includes('row-level security')) {
        return NextResponse.json(
          { 
            error: 'Storage policy belum di-setup. Silakan jalankan SQL di file storage-policies.sql di Supabase SQL Editor.',
            details: error.message 
          },
          { status: 403 }
        );
      }
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
      isPdf: isPDF,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to upload file',
        hint: 'Pastikan Storage bucket dan policies sudah di-setup. Lihat file storage-policies.sql'
      },
      { status: 500 }
    );
  }
}

