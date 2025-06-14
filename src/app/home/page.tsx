// app/home/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import MenuPage from "../menu/menu";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Server-side redirect if not logged in
  if (!session) {
    redirect("/");
  }

  // Pass the session into your client UI if you like
  return <MenuPage user={{ name: session.user?.name || undefined }} />;
}
