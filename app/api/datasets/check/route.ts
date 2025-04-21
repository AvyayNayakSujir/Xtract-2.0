import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    // Check if directory exists
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ hasDatasets: false });
    }
    
    // Check if directory has any files
    const files = await readdir(uploadsDir);
    const hasDatasets = files.length > 0;
    
    return NextResponse.json({ 
      hasDatasets,
      count: files.length
    });
  } catch (error) {
    console.error("Error checking for datasets:", error);
    return NextResponse.json(
      { error: "Failed to check for datasets" },
      { status: 500 }
    );
  }
}