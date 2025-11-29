import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

/**
 * Endpoint pour gérer le callback OAuth de Google
 * GET /api/auth/callback?code=...
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, error } = req.query;

  if (error) {
    console.error("OAuth error:", error);
    return res.redirect(
      `/?error=${encodeURIComponent(String(error))}`
    );
  }

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    NODE_ENV,
  } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    console.error("Missing Google OAuth credentials");
    return res.status(500).json({
      error: "Server configuration error: Missing OAuth credentials",
    });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    // Échanger le code d'autorisation contre des tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Stocker les tokens (dans un vrai projet, utilisez une base de données)
    // Pour Vercel, on peut utiliser Vercel KV ou une autre solution
    // Pour l'instant, on les stocke dans les cookies (non sécurisé pour la prod, mais fonctionnel)
    
    // Option 1: Stocker dans les cookies (simple mais limité)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    };

    res.setHeader(
      "Set-Cookie",
      `google_access_token=${tokens.access_token}; Path=/; ${cookieOptions.httpOnly ? "HttpOnly" : ""}; ${cookieOptions.secure ? "Secure" : ""}; SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}`
    );

    if (tokens.refresh_token) {
      res.setHeader(
        "Set-Cookie",
        `google_refresh_token=${tokens.refresh_token}; Path=/; HttpOnly; ${cookieOptions.secure ? "Secure" : ""}; SameSite=${cookieOptions.sameSite}; Max-Age=${60 * 60 * 24 * 30}` // 30 jours pour refresh token
      );
    }

    // Rediriger vers la page d'accueil avec un message de succès
    res.redirect(302, "/?auth=success");
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).json({
      error: "Failed to complete authentication",
      details: NODE_ENV === "development" ? String(error) : undefined,
    });
  }
}

