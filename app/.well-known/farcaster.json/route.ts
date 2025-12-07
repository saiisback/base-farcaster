import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    "frame": {
    "name": "baseneko",
    "version": "1",
    "iconUrl": "https://pur-base.vercel.app/default.png",
    "homeUrl": "https://pur-base.vercel.app",
    "imageUrl": "https://pur-base.vercel.app/default.png",
    "splashImageUrl": "https://pur-base.vercel.app/default.png",
    "splashBackgroundColor": "#000000",
    "webhookUrl": "https://pur-base.vercel.app/api/webhook",
    "subtitle": "cat that gets you everything",
    "description": "have fun with cat",
    "primaryCategory": "education"
  },
    "accountAssociation": {
      "header": "eyJmaWQiOjE1NzA1NTMsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhBMEQ4ZDhiNzgyNWQwMDViMmQ1NmU2NDdkZkY1MDVBODZERjQ1ZDVCIn0",
      "payload": "eyJkb21haW4iOiJwdXItYmFzZS52ZXJjZWwuYXBwIn0",
      "signature": "rs8rx/Rnu/UsKEIMsmRLU4P8WU8wFQzx7Ti1451XUxlKoiUcAcx0oWi6oNbpjEJAktiUtB/CMeN4WjzKWEYchBw="
    }
  }

  return NextResponse.json(farcasterConfig);
}


