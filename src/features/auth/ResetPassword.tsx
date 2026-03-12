import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, Sparkles, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../auth/context/AuthContext";
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    try {
      setIsLoading(true);

      await resetPassword(token, password);

      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black p-4">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">

          <div className="w-20 h-20 mx-auto flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Password Reset Successful
          </h2>

          <p className="text-gray-300 mb-6">
            Your password has been updated successfully.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
          >
            Go to Login
            <Sparkles className="w-4 h-4" />
          </button>

        </div>
      </div>
    );
  }

  return (
    <>
    <Header/>
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black p-4">

      <div className="w-full max-w-md">

        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-8">

          <div className="text-center mb-8">

            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">
              Reset Password
            </h2>

            <p className="text-gray-300">
              Create a new secure password
            </p>

          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Password */}

            <div>
              <label className="block text-sm text-gray-200 mb-2">
                New Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="block text-sm text-gray-200 mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="Confirm password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

          </form>

        </div>

      </div>

    </div>
        <Footer />
    </>
   
  );
}