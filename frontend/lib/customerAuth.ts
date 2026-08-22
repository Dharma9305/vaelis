import { auth } from "@/lib/firebase";

export async function getCustomerAuthHeader(): Promise<string | null> {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  const token = await user.getIdToken();

  return `Bearer ${token}`;
}