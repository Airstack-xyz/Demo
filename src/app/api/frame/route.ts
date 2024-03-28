import { NextRequest } from 'next/server';
import { ALLOWED_ORIGINS } from '../contants';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const origin = req.headers.get('origin');
  const secret = process.env.FRAMES_VALIDATION_BYPASS_SECRET;

  if (!secret || !origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new Response('Invalid request', { status: 400 });
  }

  const postUrl = body?.postUrl;
  const farcasterId = body?.fid || -1;
  const buttonIndex = body?.buttonIndex || 1;
  const inputText = body?.inputText || '';
  const state = body?.state || '';

  const mockFrameRequestBody = {
    secret: secret,
    untrustedData: {
      fid: farcasterId,
      url: postUrl,
      timestamp: Date.now(),
      buttonIndex: buttonIndex,
      inputText: inputText,
      state: state,
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
