export function emailValidator(email: string): boolean {
  if (!email) return false;

  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;

  const freeDomains = [
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
    "live.com", "aol.com", "icloud.com", "protonmail.com",
    "gmx.com", "yandex.com", "zohomail.com", "rediffmail.com",
  ];

  // Reject common free domains
  if (freeDomains.includes(domain)) return false;

  // Must contain at least one dot (like company.com or edu.org)
  const isValidCompanyDomain = /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain);

  return isValidCompanyDomain;
}
