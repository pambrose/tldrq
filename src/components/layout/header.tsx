import { SignOutButton } from "./sign-out-button";

export function Header({ userEmail }: { userEmail: string }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">Reading List</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{userEmail}</span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
