"use client";

import { useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CameraIcon, CircleCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";

const steps = ["Details", "Logo", "Success"] as const;
type Step = (typeof steps)[number];

export default function CreateOrganization() {
  const [step, setStep] = useState<Step>("Details");
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from name unless user edits slug
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setOrgName(name);
    if (!slugEdited) {
      setOrgSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
      );
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    setSlugEdited(true);
  }

  async function uploadLogo(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/r2", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setLogoUrl(data.url);
      setLogoPreview(data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setLogoUrl(null);
      setLogoPreview(null);
    } finally {
      setUploading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      uploadLogo(file);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadLogo(file);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const { data, error } = await authClient.organization.create({
        name: orgName,
        slug: orgSlug,
        logo: logoUrl || undefined,
        keepCurrentActiveOrganization: false,
      });
      if (error) {
        setError(error.message || "Failed to create organization");
        setCreating(false);
        return;
      }
      setCreating(false);
      setStep("Success");
    } catch (err: any) {
      setError(err.message || "Failed to create organization");
      setCreating(false);
    }
  }

  function resetWizard() {
    setStep("Details");
    setOrgName("");
    setOrgSlug("");
    setSlugEdited(false);
    setLogoUrl(null);
    setLogoPreview(null);
    setError("");
  }

  // Animation config
  const transition = {
    duration: 0.6,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create Organization</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold">
              {step === "Success" ? "Welcome!" : "Create an Organization"}
            </DialogTitle>
            <DialogDescription>
              {step === "Success"
                ? "Your organization has been created."
                : "Create or join an organization to continue"}
            </DialogDescription>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {step === "Details" && (
              <motion.form
                key="details"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={transition}
                className="flex flex-col gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!orgName.trim() || !orgSlug.trim()) {
                    setError("Name and slug are required");
                    return;
                  }
                  setError("");
                  setStep("Logo");
                }}
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <Label
                      htmlFor="orgName"
                      className="mb-2 text-muted-foreground block"
                    >
                      Organization Name
                    </Label>
                    <Input
                      id="orgName"
                      placeholder="Acme Inc."
                      value={orgName}
                      onChange={handleNameChange}
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="orgSlug"
                      className="mb-2 text-muted-foreground block"
                    >
                      Organization Slug
                    </Label>
                    <Input
                      id="orgSlug"
                      placeholder="your-slug"
                      value={orgSlug}
                      onChange={handleSlugChange}
                      required
                    />
                  </div>
                </div>
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button type="submit" className="w-full">
                    Next
                  </Button>
                </div>
              </motion.form>
            )}
            {step === "Logo" && (
              <motion.form
                key="logo"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={transition}
                className="flex flex-col gap-6"
                onSubmit={handleCreate}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Avatar className="size-24 border-2 border-muted bg-muted">
                      {logoPreview ? (
                        <AvatarImage
                          src={logoPreview}
                          alt="Organization Logo"
                        />
                      ) : null}
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 rounded-full transition">
                      {uploading ? (
                        <svg
                          className="animate-spin h-7 w-7 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                      ) : (
                        <CameraIcon className="h-7 w-7 text-white" />
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Click or drag to upload logo
                  </span>
                </div>
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("Details")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="w-40"
                    disabled={creating || uploading}
                  >
                    {creating ? "Creating..." : "Create Organization"}
                  </Button>
                </div>
              </motion.form>
            )}
            {step === "Success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={transition}
                className="flex flex-col items-center gap-6 py-8 relative"
              >
                {/* Gradient Glow */}
                <div className="absolute -inset-6 pointer-events-none z-0">
                  <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary/40 via-accent/30 to-muted/40 blur-2xl opacity-80" />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={transition}
                  className="rounded-full bg-background p-4 shadow-lg z-10"
                >
                  <CircleCheck className="h-12 w-12 text-primary" />
                </motion.div>
                <div className="text-center z-10">
                  <div className="text-lg font-semibold mb-1">
                    Organization Created!
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {orgName} ({orgSlug})
                  </div>
                </div>
                <Button className="w-full z-10" onClick={resetWizard}>
                  Get Started
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
