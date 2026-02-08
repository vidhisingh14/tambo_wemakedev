import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer and extract text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use dynamic import for pdf-parse to handle the ESM/CJS mismatch
    const pdfParse = await import('pdf-parse').then(m => (m as any).default || m);
    const data = await pdfParse(buffer);
    const text = data.text;

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('PDF extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from PDF', details: error.message },
      { status: 500 }
    );
  }
}
