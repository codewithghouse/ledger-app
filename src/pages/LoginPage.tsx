import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, LogIn, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        toast.success("Welcome to Ledger App!");
        navigate("/dashboard");
      } else {
        toast.error("Google authentication failed. Please try again.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Background Background Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-primary/10 mb-2 ring-1 ring-primary/20">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
              Ledger <span className="text-primary">App</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg">
              Smart Business Management Simplified
            </p>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 dark:border-white/5 shadow-2xl space-y-8 bg-white/50 dark:bg-black/40 backdrop-blur-xl">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-foreground">Secure Portal</h2>
            <p className="text-sm text-muted-foreground">Access your dashboard using your Google account</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="group w-full flex items-center justify-center gap-4 p-4 rounded-2xl bg-foreground text-background hover:opacity-90 transition-all duration-300 font-bold text-base shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {googleLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-secondary/30 p-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Verified & Secure Cloud Access
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 max-w-[280px] mx-auto leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
