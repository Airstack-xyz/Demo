#!/bin/bash
set -e


# removing the .env.local file because 
# next uses it if it is present
rm -f ./.env.local
echo 'current $ENV : ' $ENV
cp ./.env.$ENV ./.env.local
# building the Next.js application
npm run build