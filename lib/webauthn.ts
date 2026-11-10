export function getRpInfo(request: Request): { rpID: string; origin: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  let origin = '';
  try {
    origin = new URL(request.url).origin;
  } catch {
    origin = siteUrl || 'http://localhost:3000';
  }
  // Prefer configured site URL origin if present
  if (siteUrl) {
    try {
      origin = new URL(siteUrl).origin;
    } catch {
      // keep origin
    }
  }
  let rpID = 'localhost';
  try {
    rpID = new URL(origin).hostname;
  } catch {
    rpID = 'localhost';
  }
  if (rpID === '') rpID = 'localhost';
  return { rpID, origin };
}
