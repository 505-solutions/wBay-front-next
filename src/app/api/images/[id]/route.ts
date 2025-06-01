import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Image } from '@/models/Image';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const image = await Image.findOne({ id: params.id });

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    return new NextResponse(image.data, {
      headers: {
        'Content-Type': image.contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error retrieving image:', error);
    return NextResponse.json(
      { error: 'Error retrieving image' },
      { status: 500 }
    );
  }
} 