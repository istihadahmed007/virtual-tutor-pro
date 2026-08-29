import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { useRecaptcha } from "@/hooks/use-recaptcha";
import { LazyImage } from "@/components/images/LazyImage";
import { AUTH_SIDE_IMAGE } from "@/lib/images";
import logo from "@/assets/logo.svg";
import {
  ArrowRight,
  Loader2,
  Mail,
  UserX,
  GraduationCap,
  BookOpen,
  Video,
  Star,
  ShieldCheck,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) return returnTo;
  return fallback;
}

type AuthStep = "role" | "signIn" | { email: string };

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const {
    isLoading: authLoading,
    isAuthenticated,
    signIn,
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const setRole = useMutation(api.users.setRole);
  const verifyRecaptcha = useAction(api.recaptcha.verify);
  const { executeRecaptcha, isConfigured } = useRecaptcha();

  const [step, setStep] = useState<AuthStep>("role");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleRoleSelect = async (role: "student" | "teacher") => {
    try {
      await setRole({ role });
    } catch {
      // Role might already be set, continue to sign in
    }
    setStep("signIn");
  };

  const verifyAndProceed = async (action: string) => {
    if (!isConfigured) {
      throw new Error(
        "Security verification is not configured. Please contact support.",
      );
    }
    setStatusMessage("Verifying...");
    const token = await executeRecaptcha(action);
    await verifyRecaptcha({ token, expectedAction: action });
    setStatusMessage(null);
  };

  const handleEmailSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setStatusMessage(null);
    try {
      await verifyAndProceed("sign_in_email");

      setStatusMessage("Sending verification code...");
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setStatusMessage(null);
    } catch (err) {
      console.error("Sign-in error:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to send verification code.";
      if (msg.includes("Security verification") || msg.includes("Verification failed") || msg.includes("couldn't verify") || msg.includes("not configured")) {
        setError(msg);
      } else {
        setError(msg);
      }
      setStatusMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setStatusMessage(null);
    try {
      await verifyAndProceed("verify_otp");

      setStatusMessage("Creating your account...");
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (err) {
      console.error("OTP verify error:", err);
      const msg =
        err instanceof Error ? err.message : "Verification failed.";
      if (msg.includes("Security verification") || msg.includes("Verification failed") || msg.includes("couldn't verify") || msg.includes("not configured")) {
        setError(msg);
      } else {
        setError("The verification code you entered is incorrect.");
      }
      setStatusMessage(null);
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    setStatusMessage(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (err) {
      setError(
        `Failed to sign in as guest: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF8]">
      {/* Left: Visual side panel (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <LazyImage
          src={AUTH_SIDE_IMAGE}
          alt="Students and teacher engaged in a collaborative learning session"
          aspectRatio="auto"
          objectFit="cover"
          className="w-full h-full"
          wrapperClassName="w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <div className="max-w-md">
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Meet Your Teacher.
              <br />
              <span className="text-teal-300">Learn Together.</span>
            </h2>
            <p className="text-base text-slate-200 mt-3 leading-relaxed">
              Join thousands of students learning through live, interactive
              classes with verified expert teachers.
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Video className="w-4 h-4 text-teal-300" />
                Live video classes
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                4.8 avg rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex items-center justify-center h-full flex-col w-full max-w-md">
          <Card className="w-full border shadow-md">
            {/* Step 1: Role Selection */}
            {step === "role" && (
              <>
                <CardHeader className="text-center">
                  <div className="flex justify-center">
                    <img
                      src={logo}
                      alt="Virtual Tutor Pro"
                      width={56}
                      height={56}
                      className="rounded-xl mb-4 mt-4 cursor-pointer"
                      onClick={() => navigate("/")}
                    />
                  </div>
                  <CardTitle className="text-xl">Welcome to Virtual Tutor Pro</CardTitle>
                  <CardDescription>
                    How will you use the platform?
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="space-y-3">
                    <button
                      onClick={() => handleRoleSelect("student")}
                      className="w-full p-4 rounded-xl border-2 border-stone-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                          <BookOpen className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            I want to Learn
                          </p>
                          <p className="text-xs text-slate-500">
                            Find teachers and book live classes
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-teal-600 transition-colors" />
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleSelect("teacher")}
                      className="w-full p-4 rounded-xl border-2 border-stone-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <GraduationCap className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            I want to Teach
                          </p>
                          <p className="text-xs text-slate-500">
                            Share your expertise and earn
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </button>
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 2: Email Entry */}
            {step === "signIn" && (
              <>
                <CardHeader className="text-center">
                  <div className="flex justify-center">
                    <img
                      src={logo}
                      alt="Virtual Tutor Pro"
                      width={56}
                      height={56}
                      className="rounded-xl mb-4 mt-4 cursor-pointer"
                      onClick={() => navigate("/")}
                    />
                  </div>
                  <CardTitle className="text-xl">Get Started</CardTitle>
                  <CardDescription>
                    Enter your email to sign in or create an account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailSubmit}>
                  <CardContent>
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          name="email"
                          placeholder="name@example.com"
                          type="email"
                          className="pl-9"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="outline"
                        size="icon"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {statusMessage && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-teal-600">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {statusMessage}
                      </div>
                    )}

                    {error && (
                      <div className="mt-2 p-2.5 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {!isConfigured && (
                      <p className="mt-2 text-xs text-amber-600">
                        Security verification is not configured. Contact support.
                      </p>
                    )}

                    <div className="mt-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-4"
                        onClick={handleGuestLogin}
                        disabled={isLoading}
                      >
                        <UserX className="mr-2 h-4 w-4" /> Continue as Guest
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </>
            )}

            {/* Step 3: OTP Verification */}
            {typeof step === "object" && (
              <>
                <CardHeader className="text-center mt-4">
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>
                  <CardTitle>Check your email</CardTitle>
                  <CardDescription>
                    We've sent a 6-digit code to <strong>{step.email}</strong>
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleOtpSubmit}>
                  <CardContent className="pb-4">
                    <input type="hidden" name="email" value={step.email} />
                    <input type="hidden" name="code" value={otp} />
                    <div className="flex justify-center">
                      <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={6}
                        disabled={isLoading}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            otp.length === 6 &&
                            !isLoading
                          ) {
                            const form = (
                              e.target as HTMLElement
                            ).closest("form");
                            if (form) form.requestSubmit();
                          }
                        }}
                      >
                        <InputOTPGroup>
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {statusMessage && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-teal-600">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {statusMessage}
                      </div>
                    )}

                    {error && (
                      <div className="mt-2 p-2.5 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600 text-center">{error}</p>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground text-center mt-4">
                      Didn't receive a code?{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => setStep("signIn")}
                      >
                        Try again
                      </Button>
                    </p>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          {statusMessage || "Verifying..."}
                        </>
                      ) : (
                        <>
                          Verify code{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep("signIn")}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Use different email
                    </Button>
                  </CardFooter>
                </form>
              </>
            )}

            <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-muted border-t rounded-b-lg flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Protected by Google reCAPTCHA
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
