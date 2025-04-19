"use client";

export const SignInButton = () => {
  const handleSignIn = async () => {
    // This will be handled by a server action
    window.location.href = '/api/auth/signin';
  };

  return (
    <button
      onClick={handleSignIn}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
    >
      Sign in with Google
    </button>
  );
}; 