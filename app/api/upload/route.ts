import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Process each file
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const datasetId = uuidv4();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const originalFilename = file.name;
        const fileExtension = originalFilename.split('.').pop();
        
        // Create file name with UUID to avoid collisions
        const fileName = `${datasetId}-${timestamp}.${fileExtension}`;
        const filePath = path.join(uploadsDir, fileName);
        
        // Write file to disk
        await writeFile(filePath, buffer);
        
        // Return metadata
        return {
          datasetId,
          originalName: originalFilename,
          storedName: fileName,
          path: filePath,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        };
      })
    );

    // Return success response with dataset IDs
    return NextResponse.json({
      success: true,
      message: `${files.length} file(s) uploaded successfully`,
      datasetIds: uploadedFiles.map(file => file.datasetId),
      files: uploadedFiles
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 }
    );
  }
}

// Increase body size limit for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};