"use client";
import React, { useState } from "react";
import RelaykitLogo from "@/components/wordmark";
import { AnimatedGradient } from "@/components/ui/stripe-animates-gradient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    authClient.signUp.email({ name, email, password });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedGradient />
      <div className="relative z-10 w-full max-w-md p-4">
        <Card className="rounded-2xl shadow-2xl border border-border bg-background/50 backdrop-blur">
          <CardHeader className="flex flex-col items-center gap-2">
            <RelaykitLogo className="h-6 w-auto mb-2" />
            <CardTitle className="text-2xl font-bold tracking-tighter text-center">
              Sign up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSignUp}>
              <Input
                type="text"
                placeholder="First name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email address"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Repeat password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <Button className="w-full mt-2" type="submit">
                Sign Up
              </Button>
            </form>
            <div className="flex items-center my-6">
              <Separator className="flex-1" />
              <span className="mx-3 text-xs text-muted-foreground uppercase tracking-wider">
                or
              </span>
              <Separator className="flex-1" />
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => authClient.signIn.social({ provider: "github" })}
            >
              <FaGithub className="h-5 w-5" /> Sign up with GitHub
            </Button>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/sign-in" className="underline text-primary">
                Sign in
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
