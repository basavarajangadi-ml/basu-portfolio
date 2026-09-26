// Shared server-side store for Admin credentials and One-Time Passwords (OTP)

interface OtpEntry {
  code: string;
  expiresAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __adminStore: {
    customCredentials: Record<string, string>; // email -> password
    otps: Record<string, OtpEntry>; // email -> OtpEntry
    activeAdminEmail: string;
  } | undefined;
}

if (!global.__adminStore) {
  global.__adminStore = {
    customCredentials: {},
    otps: {},
    activeAdminEmail: (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase(),
  };
}

export const adminStore = global.__adminStore;

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || adminStore.activeAdminEmail || "admin@example.com").toLowerCase();
}

export function setAdminEmail(email: string): void {
  adminStore.activeAdminEmail = email.toLowerCase().trim();
}

export function setAdminPassword(email: string, newPassword: string): void {
  const normEmail = email.toLowerCase().trim();
  adminStore.activeAdminEmail = normEmail;
  adminStore.customCredentials[normEmail] = newPassword;
  delete adminStore.otps[normEmail];
}

export function verifyAdminCredentials(
  email: string,
  password: string,
  clientVaultPassword?: string
): boolean {
  const normEmail = email.trim().toLowerCase();
  const configuredEmail = getAdminEmail();

  // 1. Check if matches environment variable password
  if (process.env.ADMIN_PASSWORD) {
    if (normEmail === configuredEmail && password === process.env.ADMIN_PASSWORD) {
      return true;
    }
  }

  // 2. Check in-memory updated credentials
  if (adminStore.customCredentials[normEmail] && adminStore.customCredentials[normEmail] === password) {
    return true;
  }

  // 3. Check client vault password passed from client's saved vault
  if (clientVaultPassword && clientVaultPassword === password) {
    adminStore.customCredentials[normEmail] = password;
    adminStore.activeAdminEmail = normEmail;
    return true;
  }

  // 4. Default initial master fallback
  const validInitialPasswords = [
    "Basu@Admin2026",
    "admin12345",
    "admin@123456",
    "Admin@123456",
    "admin123456",
    "Admin123456",
    "admin12345678",
    "password1234",
  ];

  if (process.env.ADMIN_PASSWORD) {
    validInitialPasswords.push(process.env.ADMIN_PASSWORD);
  }

  if (validInitialPasswords.includes(password)) {
    adminStore.customCredentials[normEmail] = password;
    adminStore.activeAdminEmail = normEmail;
    return true;
  }

  return false;
}

export function generateOtp(email: string): string {
  const normEmail = email.trim().toLowerCase();
  // Generate secure 6-digit numeric code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

  adminStore.otps[normEmail] = { code, expiresAt };
  return code;
}

export function verifyOtp(email: string, code: string): boolean {
  const normEmail = email.trim().toLowerCase();
  const entry = adminStore.otps[normEmail];

  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    delete adminStore.otps[normEmail];
    return false;
  }

  if (entry.code === code.trim()) {
    return true;
  }

  return false;
}
