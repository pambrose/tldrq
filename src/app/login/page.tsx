import { LoginButtons } from "@/components/auth/login-buttons";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Reading List</h1>
          <p className="mt-2 text-sm text-gray-600">
            Save, organize, and track your reading
          </p>
        </div>
        <LoginButtons />
      </div>
    </div>
  );
}
