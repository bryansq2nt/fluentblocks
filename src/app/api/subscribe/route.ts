import { NextResponse } from 'next/server';

// POST /api/subscribe
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const response = await fetch(process.env.NEXT_PUBLIC_EMAIL_WEBHOOK!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        date: new Date().toISOString(),
      }),
    });

    if (!response.ok) throw new Error('Failed to subscribe email');
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    // If not JSON, return success with the status text
    return NextResponse.json({ 
      success: true, 
      message: response.statusText || 'Email subscribed successfully' 
    });
  } catch (error) {
    console.error('Error subscribing email:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe email' },
      { status: 500 }
    );
  }
} 