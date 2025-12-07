import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    // TODO: Add your own account association
    frame: {
      version: "1",
      name: "Baseneko",
      iconUrl: `https://pur-base.vercel.app/images/default.png`,
      homeUrl: `https://pur-base.vercel.app`,
      imageUrl: `https://pur-base.vercel.app/images/default.png`,
      screenshotUrls: [],
      tags: ["baseneko", "farcaster", "miniapp", "template"],
      primaryCategory: "education",
      buttonTitle: "Launch Baseneko",
      splashImageUrl: `https://pur-base.vercel.app/images/default.png`,
      splashBackgroundColor: "#ffffff",
      webhookUrl: `https://pur-base.vercel.app/api/webhook`,
      "accountAssociation": {
        "header": "eyJmaWQiOjE1NzA1NTMsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhBMEQ4ZDhiNzgyNWQwMDViMmQ1NmU2NDdkZkY1MDVBODZERjQ1ZDVCIn0",
        "payload": "eyJkb21haW4iOiJwdXItYmFzZS52ZXJjZWwuYXBwIn0",
        "signature": "rs8rx/Rnu/UsKEIMsmRLU4P8WU8wFQzx7Ti1451XUxlKoiUcAcx0oWi6oNbpjEJAktiUtB/CMeN4WjzKWEYchBw="
      }
    },
  };

  return NextResponse.json(farcasterConfig);
}


