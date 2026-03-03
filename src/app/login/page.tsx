import { Suspense } from "react";
import { LoginButtons } from "@/components/auth/login-buttons";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-sm space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reading List</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Save, organize, and track your reading
          </p>
        </div>
        <Suspense>
          <LoginButtons />
        </Suspense>
      </div>
    </div>
  );
}
