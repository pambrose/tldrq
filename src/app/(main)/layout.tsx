import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header userEmail={user.email || "User"} />
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
