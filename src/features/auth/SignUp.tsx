import { useState } from "react";
import { useAuth } from "../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  UserPlus,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (password: string) => {
     let score = 0;

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  Object.values(checks).forEach(Boolean => {
    if (Boolean) score++;
  });

  let label = "Weak";
  let color = "bg-red-500";

  if (score >= 4) {
    label = "Strong";
    color = "bg-green-500";
  } else if (score >= 3) {
    label = "Good";
    color = "bg-yellow-500";
  } else if (score >= 2) {
    label = "Fair";
    color = "bg-orange-500";
  }

  return { score, label, color, checks };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms and Privacy Policy");
      return;
    }

    try {
      setIsLoading(true);
      await register(email, password, name);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Header />
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-indigo-900 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Create Account
          </h2>
          <p className="text-gray-300">
            Start your learning journey today
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

       <div className="mt-3 space-y-2">
<div className="relative">
  {/* Lock Icon */}
  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />

  {/* Input Field */}
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  {/* Show / Hide Button */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition"
  >
    {showPassword ? <EyeOff /> : <Eye />}
  </button>
</div>

{/* Strength Section */}
{password.length > 0 && (
  <div className="mt-3 space-y-2">
    {/* Strength Label */}
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400">Strength:</span>
      <span className={`font-semibold ${passwordStrength.color.replace("bg-", "text-")}`}>
        {passwordStrength.label}
      </span>
    </div>

    {/* Progress Bar */}
    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
      <div
        className={`${passwordStrength.color} h-full transition-all duration-300`}
        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
      />
    </div>

    {/* Checklist */}
    <ul className="text-xs space-y-1">
      <li className={passwordStrength.checks.length ? "text-green-400" : "text-gray-400"}>
        ✓ At least 8 characters
      </li>
      <li className={passwordStrength.checks.uppercase ? "text-green-400" : "text-gray-400"}>
        ✓ One uppercase letter
      </li>
      <li className={passwordStrength.checks.number ? "text-green-400" : "text-gray-400"}>
        ✓ One number
      </li>
      <li className={passwordStrength.checks.special ? "text-green-400" : "text-gray-400"}>
        ✓ One special character
      </li>
    </ul>
  </div>
)}

</div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 top-3.5 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {confirmPassword && password === confirmPassword && (
            <p className="text-green-400 text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Passwords match
            </p>
          )}

          {/* Terms */}
          <div className="flex items-start gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) =>
                setAgreedToTerms(e.target.checked)
              }
            />
            <span>I agree to the Terms & Privacy Policy</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1"
          >
            Sign in <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
   
  );
}
