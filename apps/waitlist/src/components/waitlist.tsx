"use client";
import { useState, useEffect } from "react";
import { BlurReveal } from "./ui/blur-reveal";
import { Input } from "./ui/input";
import { StaggerButton } from "./ui/stagger-button";
import { Loader2 } from "lucide-react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchCount() {
      try {
        const res = await fetch("/api/waitlist/join");
        const data = await res.json();
        if (isMounted && typeof data.count === "number") setCount(data.count);
      } catch {}
    }
    fetchCount();
    const interval = setInterval(fetchCount, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <BlurReveal delay={0.4}>
      <form className="mt-6 flex gap-2 items-center" onSubmit={handleSubmit}>
        <Input
          className="h-10 !backdrop-blur-md !bg-background/20"
          placeholder="example@0.email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          disabled={loading || success}
        />
        <StaggerButton
          className="cursor-pointer"
          type="submit"
          disabled={loading || success}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : success ? (
            "You're in!"
          ) : (
            "Get me in"
          )}
        </StaggerButton>
      </form>
      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
      {count !== null && (
        <div className="text-center text-xs text-muted-foreground mb-2 mt-2">
          {count} {count === 1 ? "person has" : "people have"} joined the
          waitlist
        </div>
      )}
    </BlurReveal>
  );
}
