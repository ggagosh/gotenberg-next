import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const response = await fetch(`${process.env.GOTENBERG_URL}/forms/libreoffice/convert`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.log(response);
      throw new Error('Conversion failed');
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="converted.pdf"',
      },
    });
  } catch (error) {
    console.error('Error converting file:', error);
    return NextResponse.json({ error: 'Failed to convert file' }, { status: 500 });
  }
}
