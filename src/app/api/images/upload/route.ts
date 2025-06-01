import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Image } from '@/models/Image';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const id = formData.get('id') as string;

    if (!file || !id) {
      return NextResponse.json(
        { error: 'File and ID are required' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await connectDB();

    const image = new Image({
      id,
      data: buffer,
      contentType: file.type,
    });

    await image.save();

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Error uploading image' },
      { status: 500 }
    );
  }
} 