"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function validate() {
    let valid = true;

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (result.error) {
        toast.error(
          result.error.message || "Invalid credentials. Please try again."
        );
        return;
      }

      // Successful — redirect
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Background gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[600px] rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -bottom-40 size-[500px] rounded-full bg-primary/8 blur-[100px]"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand mark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/logo__2_-removebg-preview.png"
            alt="Httply logo"
            width={64}
            height={64}
            priority
            className="drop-shadow-xl"
          />
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Httply Admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your admin account
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl shadow-foreground/5 ring-1 ring-foreground/8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form id="login-form" onSubmit={handleSubmit} noValidate>
              <FieldGroup className="gap-5">
                {/* Email field */}
                <Field>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@httply.qzz.io"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!emailError}
                      className="pl-9"
                    />
                  </div>
                  {emailError && <FieldError>{emailError}</FieldError>}
                </Field>

                {/* Password field */}
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                  </div>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={!!passwordError}
                      className="px-9"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && <FieldError>{passwordError}</FieldError>}
                </Field>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />
                  <label
                    htmlFor="remember-me"
                    className="cursor-pointer select-none text-sm text-muted-foreground"
                  >
                    Keep me signed in
                  </label>
                </div>
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-4 pt-2">
            <Button
              form="login-form"
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="size-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Admin access only · Httply © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
