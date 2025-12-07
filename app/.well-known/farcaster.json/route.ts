import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    // TODO: Add your own account association
    frame: {
      version: "1",
      name: "Monad Farcaster MiniApp Template",
      iconUrl: `${APP_URL}/images/icon.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/images/feed.png`,
      screenshotUrls: [],
      tags: ["monad", "farcaster", "miniapp", "template"],
      primaryCategory: "developer-tools",
      buttonTitle: "Launch Template",
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#ffffff",
      webhookUrl: `${APP_URL}/api/webhook`,
      accountAssociation: {
        "accountAssociation": {
          "header": "eyJmaWQiOjE1NzA1NTMsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhBMEQ4ZDhiNzgyNWQwMDViMmQ1NmU2NDdkZkY1MDVBODZERjQ1ZDVCIn0",
          "payload": "eyJkb21haW4iOiJwdXItYmFzZS52ZXJjZWwuYXBwIn0",
          "signature": "rs8rx/Rnu/UsKEIMsmRLU4P8WU8wFQzx7Ti1451XUxlKoiUcAcx0oWi6oNbpjEJAktiUtB/CMeN4WjzKWEYchBw="
        }}
    },
  };

  return NextResponse.json(farcasterConfig);
}
