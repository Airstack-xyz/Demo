import { NextRequest, NextResponse } from 'next/server';
import {
  ALLOWED_ORIGINS,
  API_KEY_0X,
  SELL_TOKEN_ADDRESS
} from '../../contants';
import { getAmount } from './getAmount';

type Payload = {
  tokenAddress?: string;
};

export interface ErrorResponse0x {
  code: number;
  reason: string;
  validationErrors: ValidationError[];
}

export interface ValidationError {
  field: string;
  code: number;
  reason: string;
  description: string;
}

export type ValidateAddressResponse = {
  message?: string;
  error?: 'INVALID_REQUEST' | 'VALIDATION_ERROR' | 'SERVER_ERROR';
  rawResonse?: any;
  data?: {
    isValid: boolean;
  };
};

export async function POST(req: NextRequest) {
  const body: Payload = await req.json();

  const origin = req.headers.get('origin');

  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    const response: ValidateAddressResponse = {
      error: 'INVALID_REQUEST',
      message: 'Invalid request'
    };

    return new NextResponse(JSON.stringify(response), { status: 400 });
  }
  if (!body.tokenAddress) {
    const response: ValidateAddressResponse = {
      error: 'INVALID_REQUEST',
      message: 'Invalid token address'
    };
    return new NextResponse(JSON.stringify(response), { status: 400 });
  }

  const requestHeaders = new Headers();

  requestHeaders.append('0x-api-key', API_KEY_0X);
  requestHeaders.append('Content-Type', 'application/json');

  const raw = '';

  const requestOptions = {
    method: 'GET',
    headers: requestHeaders,
    body: raw
    // redirect: 'follow'
  };

  const tokenAddress = body.tokenAddress;
  const amount = await getAmount(1, tokenAddress);
  if (!amount) {
    const response: ValidateAddressResponse = {
      error: 'SERVER_ERROR',
      message: 'Unable to fetch decimal for token'
    };
    return new NextResponse(JSON.stringify(response), { status: 400 });
  }

  const res = await fetch(
    `https://base.api.0x.org/swap/v1/price?sellToken=${SELL_TOKEN_ADDRESS}&buyToken=${tokenAddress}&buyAmount=${amount}`,
    requestOptions
  )
    .then(response => response.text())
    .then(result => {
      console.log(result);
      return result;
    })
    .catch(error => {
      console.error(error);
      return error;
    });

  const errroRes: ErrorResponse0x = res;
  if (errroRes?.validationErrors?.length) {
    const response: ValidateAddressResponse = {
      error: 'VALIDATION_ERROR',
      message: 'Validation error',
      rawResonse: errroRes.validationErrors
    };
    return new NextResponse(JSON.stringify(response), {
      status: 400
    });
  }

  const response: ValidateAddressResponse = {
    data: {
      isValid: true
    },
    rawResonse: errroRes.validationErrors
  };
  return new NextResponse(JSON.stringify(response), {
    status: 200
  });
}
