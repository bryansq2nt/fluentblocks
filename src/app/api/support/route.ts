import { NextResponse } from 'next/server';

// GET /api/support
export async function GET() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_GET_SUPPORT_WEBHOOK!);
    if (!response.ok) throw new Error('Failed to fetch support count');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching support count:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

// POST /api/support
export async function POST() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_ADD_SUPPORT_WEBHOOK!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to add support');
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    // If not JSON, return success with the status text
    return NextResponse.json({ 
      success: true, 
      message: response.statusText || 'Support added successfully' 
    });
  } catch (error) {
    console.error('Error adding support:', error);
    return NextResponse.json(
      { error: 'Failed to add support' },
      { status: 500 }
    );
  }
} 