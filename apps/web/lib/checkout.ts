export function buildCheckoutLink({
  offer,
  reportId,
  email
}: {
  offer: string;
  reportId?: string | null;
  email?: string | null;
}) {
  const params = new URLSearchParams({ offer });

  if (reportId) {
    params.set("report", reportId);
  }

  if (email) {
    params.set("email", email);
  }

  return `/api/checkout?${params.toString()}`;
}
