import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const postUrl = body.postUrl;

  const mockFrameRequestBody = {
    secret: process.env.FRAMES_VALIDATION_BYPASS_SECRET,
    untrustedData: {
      fid: -1,
      url: postUrl,
      messageHash: '',
      timestamp: Date.now(),
      network: 1,
      buttonIndex: 1,
      castId: {
        fid: -1,
        hash: '0x0000000000000000000000000000000000000001'
      }
    },
    trustedData: {
      messageBytes: '123456'
    }
  };

  try {
    const response = await fetch(postUrl, {
      method: 'POST',
      body: JSON.stringify(mockFrameRequestBody)
    });

    const html = await response.text();

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      }
    });
  } catch (err) {
    console.log(`[Error] Frame Post ${postUrl}`, err);
  }

  return new Response('Invalid request', { status: 400 });
}
