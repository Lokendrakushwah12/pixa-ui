import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string } }
) {
  try {
    const { path } = params;
    
    // Construct the path to the example file
    const examplePath = join(
      process.cwd(),
      'examples',
      `${path}.tsx`
    );

    // Read the example file
    const code = await readFile(examplePath, 'utf-8');

    // Return the code as plain text
    return new NextResponse(code, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error reading example file:', error);
    return new NextResponse('Example not found', { status: 404 });
  }
} 