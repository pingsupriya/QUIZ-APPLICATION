import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    const amount = searchParams.get('amount') || '15';
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    // Build the API URL with query parameters
    const params = new URLSearchParams({
      amount: amount,
      type: 'multiple', // Multiple choice questions only
    });

    // Add optional parameters if provided
    if (category) {
      params.append('category', category);
    }
    if (difficulty) {
      params.append('difficulty', difficulty);
    }

    const url = `https://opentdb.com/api.php?${params.toString()}`;
    
    console.log('Proxying request to:', url);

    // Fetch data from the Open Trivia Database API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Check if the API returned an error
    if (data.response_code !== 0) {
      throw new Error(`API error! response_code: ${data.response_code}`);
    }

    // Return the data
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch quiz questions',
      },
      { status: 500 }
    );
  }
} 