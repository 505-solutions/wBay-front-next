import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Image } from '@/models/Image';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const images = await Image.find({}, { data: 0 }); // Exclude the binary data from the response

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Error fetching images' },
      { status: 500 }
    );
  }
} 