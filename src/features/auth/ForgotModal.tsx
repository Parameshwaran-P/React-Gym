import { useState } from "react";

interface ForgotPasswordErrors {
  email?: string;
  success?: string;
}

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    try {
      setIsLoading(true);

      // 🔌 API call here
      console.log("Reset email sent to:", email);

      setErrors({ success: "Password reset link sent to your email." });
    } catch (error) {
      setErrors({ email: "Failed to send reset link" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email and we’ll send you a reset link.
        </p>

        {errors.success && (
          <p className="text-green-600 text-sm text-center mb-4">
            {errors.success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({});
            }}
            className="w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
