import { NextResponse } from 'next/server';

// GET /api/comments
export async function GET() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_GET_COMMENTS_WEBHOOK!);
    if (!response.ok) throw new Error('Failed to fetch comments');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ comments: [] }, { status: 500 });
  }
}

// POST /api/comments
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(process.env.NEXT_PUBLIC_ADD_COMMENT_WEBHOOK!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error('Failed to add comment');
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    // If not JSON, return success with the status text
    return NextResponse.json({ 
      success: true, 
      message: response.statusText || 'Comment added successfully' 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
} 