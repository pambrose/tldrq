import {Suspense} from "react";
import {LoginButtons} from "@/components/auth/login-buttons";
import {version} from "@/../package.json";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto flex max-w-4xl items-baseline gap-2 px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900 dark:text-[#E8C547]">tldrq.com</h1>
          <span className="text-xs text-gray-400 dark:text-gray-500">({version})</span>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-sm space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">tldrq.com</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            The last tab you’ll ever need
          </p>
        </div>
        <Suspense>
          <LoginButtons />
        </Suspense>
      </div>
      </div>
    </div>
  );
}
