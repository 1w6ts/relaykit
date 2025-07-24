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
import {
  CameraIcon,
  CircleCheck,
  Sparkles,
  Upload,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
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
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced spring animations
  const springConfig: Transition = {
    type: "spring",
    damping: 25,
    stiffness: 300,
    mass: 0.8,
  };

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
    setUploadProgress(0);

    // Simulate upload progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + Math.random() * 30, 90));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Create preview immediately for better UX
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);

      const res = await fetch("/api/upload/r2", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadProgress(100);
      setTimeout(() => {
        setLogoUrl(data.url);
        setLogoPreview(data.url);
        URL.revokeObjectURL(previewUrl);
      }, 500);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setLogoUrl(null);
      setLogoPreview(null);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 600);
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
    setIsDragging(false);
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

      // Add delay for better UX
      setTimeout(() => {
        setCreating(false);
        setStep("Success");
      }, 1500);
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

  // Enhanced animation variants
  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      x: 60,
      scale: 0.95,
      filter: "blur(10px)",
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: -60,
      scale: 0.95,
      filter: "blur(10px)",
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const floatingVariants: Variants = {
    animate: {
      y: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="relative overflow-hidden group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100"
            initial={false}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Building2 className="w-4 h-4 mr-2" />
          Create Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-gradient-to-br from-background via-background to-muted/50 backdrop-blur-sm transition-all duration-150">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl"
            animate={{
              rotate: -360,
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        </div>

        <div className="relative z-10 p-6">
          <DialogHeader className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {step === "Success" ? (
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-6 h-6 text-primary" />
                    Welcome!
                  </motion.span>
                ) : (
                  "Create an Organization"
                )}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                {step === "Success"
                  ? "Your organization has been created successfully."
                  : "Set up your organization to get started"}
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          {/* Progress indicator */}
          {step !== "Success" && (
            <motion.div
              className="flex items-center gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {steps.slice(0, -1).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500 ${
                      step === s
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : steps.indexOf(step) > i
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                    animate={step === s ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {i + 1}
                  </motion.div>
                  {i < steps.length - 2 && (
                    <motion.div
                      className={`w-8 h-0.5 transition-all duration-500 ${
                        steps.indexOf(step) > i ? "bg-primary" : "bg-muted"
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: steps.indexOf(step) > i ? 1 : 0.3 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === "Details" && (
              <motion.form
                key="details"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
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
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="orgName"
                      className="text-sm font-medium text-foreground"
                    >
                      Organization Name
                    </Label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={springConfig}
                    >
                      <Input
                        id="orgName"
                        placeholder="Acme Inc."
                        value={orgName}
                        onChange={handleNameChange}
                        required
                        autoFocus
                        className="transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
                      />
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="orgSlug"
                      className="text-sm font-medium text-foreground"
                    >
                      Organization Slug
                    </Label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={springConfig}
                    >
                      <Input
                        id="orgSlug"
                        placeholder="acme-inc"
                        value={orgSlug}
                        onChange={handleSlugChange}
                        required
                        className="transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
                      />
                    </motion.div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="text-red-500 text-sm text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full relative overflow-hidden group"
                    size="lg"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    Continue
                  </Button>
                </motion.div>
              </motion.form>
            )}

            {step === "Logo" && (
              <motion.form
                key="logo"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-6"
                onSubmit={handleCreate}
              >
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center gap-6"
                >
                  <motion.div
                    className={`relative group cursor-pointer transition-all duration-300 ${
                      isDragging ? "scale-105" : ""
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      scale: uploading ? 1 + uploadProgress / 1000 : 1,
                    }}
                  >
                    <motion.div
                      className={`relative overflow-hidden rounded-full ${
                        isDragging
                          ? "ring-4 ring-primary/50 ring-offset-4 ring-offset-background"
                          : ""
                      }`}
                      variants={floatingVariants}
                      animate="animate"
                    >
                      <Avatar className="size-32 border-4 border-muted bg-gradient-to-br from-muted to-muted/50 shadow-xl">
                        {logoPreview ? (
                          <AvatarImage
                            src={logoPreview}
                            alt="Organization Logo"
                            className="object-cover"
                          />
                        ) : null}
                      </Avatar>

                      {/* Upload overlay */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 rounded-full transition-all duration-300"
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                      >
                        {uploading ? (
                          <motion.div
                            className="flex flex-col items-center gap-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <motion.div
                              className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            <span className="text-xs text-white font-medium">
                              {Math.round(uploadProgress)}%
                            </span>
                          </motion.div>
                        ) : (
                          <motion.div
                            className="flex flex-col items-center gap-2"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Upload className="h-8 w-8 text-white" />
                            <span className="text-xs text-white font-medium">
                              Upload Logo
                            </span>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </motion.div>

                  <motion.div
                    className="text-center space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-sm text-muted-foreground">
                      Click or drag to upload your organization logo
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      PNG, JPG up to 10MB
                    </p>
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="text-red-500 text-sm text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  variants={itemVariants}
                  className="flex justify-between gap-3"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("Details")}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 relative overflow-hidden group"
                    disabled={creating || uploading}
                    size="lg"
                  >
                    <AnimatePresence mode="wait">
                      {creating ? (
                        <motion.div
                          key="creating"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <motion.div
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Creating Magic...
                        </motion.div>
                      ) : (
                        <motion.span
                          key="create"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          Create Organization
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </motion.form>
            )}

            {step === "Success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 40 }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  staggerChildren: 0.2,
                }}
                className="flex flex-col items-center gap-8 py-8 relative"
              >
                {/* Success animation */}
                <motion.div
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    damping: 15,
                    stiffness: 300,
                  }}
                >
                  {/* Pulsing rings */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-primary/30"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{
                        scale: [1, 2, 3],
                        opacity: [0.8, 0.3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut",
                      }}
                    />
                  ))}

                  <motion.div
                    className="relative z-10 rounded-full bg-gradient-to-br from-primary to-primary/80 p-6 shadow-2xl shadow-primary/25"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <CircleCheck className="h-16 w-16 text-primary-foreground" />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="text-center space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.h3
                    className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Organization Created!
                  </motion.h3>
                  <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-lg font-medium text-foreground">
                      {orgName}
                    </p>
                    <p className="text-sm text-muted-foreground">@{orgSlug}</p>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    className="w-full relative overflow-hidden group"
                    onClick={resetWizard}
                    size="lg"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
