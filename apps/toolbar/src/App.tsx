import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, ExitIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import "./index.css";
import RelayKitLogo from "./components/logo";

interface Pin {
  id: number;
  x: number;
  y: number;
  comments: { text: string; timestamp: number; user: string }[];
}

const currentUser = "RK";

export default function App() {
  const [open, setOpen] = useState(false);
  const [pinMode, setPinMode] = useState(false);
  const [pins, setPins] = useState<Pin[]>([]);
  const [activePin, setActivePin] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const pinId = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut for pin mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "c" && !pinMode) {
        setPinMode(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pinMode]);

  // Place pin on click in pin mode
  useEffect(() => {
    if (!pinMode) return;
    const handleClick = (e: MouseEvent) => {
      const toolbar = document.getElementById("relaykit-toolbar");
      if (toolbar && toolbar.contains(e.target as Node)) return;
      if ((e.target as HTMLElement).dataset.pin) return;
      const x = e.pageX;
      const y = e.pageY;
      setPins((prev) => [...prev, { id: ++pinId.current, x, y, comments: [] }]);
      setPinMode(false);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [pinMode]);

  // Scroll to bottom of thread when new message is added or popover opens
  useEffect(() => {
    if (!scrollAreaRef.current) return;
    const viewport = scrollAreaRef.current.querySelector(
      ".scrollarea-viewport"
    );
    if (viewport) {
      (viewport as HTMLDivElement).scrollTop = (
        viewport as HTMLDivElement
      ).scrollHeight;
    }
  }, [pins, activePin]);

  // Handle comment submit
  const handleCommentSubmit = (id: number) => {
    if (!commentInput.trim()) return;
    setPins((prev) =>
      prev.map((pin) =>
        pin.id === id
          ? {
              ...pin,
              comments: [
                ...pin.comments,
                {
                  text: commentInput.trim(),
                  timestamp: Date.now(),
                  user: currentUser,
                },
              ],
            }
          : pin
      )
    );
    setCommentInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "36px";
    }
  };

  // Pins overlay as a portal
  const pinsOverlay = (
    <TooltipProvider>
      <div
        className="absolute left-0 top-0 w-full h-full pointer-events-none z-40"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {pins.map((pin) => {
          const firstComment = pin.comments[0];
          return (
            <div
              key={pin.id}
              style={{ left: pin.x, top: pin.y, position: "absolute" }}
              className="pointer-events-auto"
            >
              <Popover
                open={activePin === pin.id}
                onOpenChange={(open) => setActivePin(open ? pin.id : null)}
              >
                <Tooltip open={activePin !== pin.id ? undefined : false}>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <div
                        className="relative flex items-center group pointer-events-auto"
                        tabIndex={0}
                        aria-label="Open comment thread"
                      >
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center border-2 border-background shadow-lg group-hover:scale-110 transition-transform">
                          <PlusIcon className="w-6 h-6 text-primary-foreground" />
                        </div>
                      </div>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-left bg-background">
                    {firstComment ? (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {firstComment.user} &middot;{" "}
                          {new Date(firstComment.timestamp).toLocaleString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-sm text-foreground">
                          {firstComment.text}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No comments yet
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
                <AnimatePresence>
                  {activePin === pin.id && (
                    <PopoverContent
                      side="right"
                      align="start"
                      sideOffset={15}
                      className="w-80 rounded-2xl shadow-2xl border-none bg-popover flex flex-col p-0 h-[450px] overflow-hidden"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        className="flex flex-col h-full"
                      >
                        <header className="p-3 border-b flex items-center gap-3 flex-shrink-0">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={undefined} alt="RelayKit" />
                            <AvatarFallback className="font-bold">
                              RK
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold">Comment Thread</h3>
                        </header>
                        <ScrollArea
                          className="flex-1 min-h-0"
                          ref={scrollAreaRef}
                        >
                          <div className="p-3 space-y-3 scrollarea-viewport">
                            <AnimatePresence initial={false}>
                              {pin.comments.length === 0 ? (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="text-center py-8"
                                >
                                  <p className="text-muted-foreground text-sm font-medium">
                                    No comments yet.
                                  </p>
                                  <p className="text-muted-foreground text-xs">
                                    Be the first to reply!
                                  </p>
                                </motion.div>
                              ) : (
                                pin.comments.map((c) => (
                                  <motion.div
                                    key={c.timestamp}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 500,
                                      damping: 30,
                                    }}
                                    className={`flex items-end gap-2 ${c.user === currentUser ? "justify-end" : ""}`}
                                  >
                                    {c.user !== currentUser && (
                                      <Avatar className="w-7 h-7 border-border flex-shrink-0">
                                        <AvatarFallback>
                                          {c.user}
                                        </AvatarFallback>
                                      </Avatar>
                                    )}
                                    <div
                                      className={`flex flex-col max-w-[85%] ${c.user === currentUser ? "items-end" : "items-start"}`}
                                    >
                                      <div
                                        className={`px-3 py-1.5 rounded-xl shadow-sm ${c.user === currentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"}`}
                                      >
                                        {c.text}
                                      </div>
                                      <span className="text-xs text-muted-foreground mt-1">
                                        {new Date(
                                          c.timestamp
                                        ).toLocaleTimeString([], {
                                          hour: "numeric",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>
                                    {c.user === currentUser && (
                                      <Avatar className="w-7 h-7 border-border flex-shrink-0">
                                        <AvatarFallback>
                                          {c.user}
                                        </AvatarFallback>
                                      </Avatar>
                                    )}
                                  </motion.div>
                                ))
                              )}
                            </AnimatePresence>
                          </div>
                        </ScrollArea>
                        <form
                          className="flex items-center gap-2 p-2 border-t bg-background/80 backdrop-blur-sm flex-shrink-0"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleCommentSubmit(pin.id);
                          }}
                        >
                          <Textarea
                            ref={textareaRef}
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onInput={() => {
                              if (textareaRef.current) {
                                textareaRef.current.style.height = "36px";
                                const scrollHeight =
                                  textareaRef.current.scrollHeight;
                                textareaRef.current.style.height = `${Math.min(
                                  scrollHeight,
                                  100 // Max height for textarea
                                )}px`;
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleCommentSubmit(pin.id);
                              }
                            }}
                            placeholder="Aa"
                            className="flex-1 min-h-[36px] resize-none rounded-lg text-sm py-1.5 px-3 bg-muted border-transparent focus:border-primary focus:ring-primary"
                            style={{ height: 36 }}
                            autoFocus
                          />
                          <Button
                            type="submit"
                            className="h-9 px-4 rounded-lg"
                            disabled={!commentInput.trim()}
                          >
                            Send
                          </Button>
                        </form>
                      </motion.div>
                    </PopoverContent>
                  )}
                </AnimatePresence>
              </Popover>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );

  return (
    <>
      {/* Pins overlay rendered as a portal to body */}
      {typeof window !== "undefined" &&
        createPortal(pinsOverlay, document.body)}
      {/* Toolbar */}
      <div
        id="relaykit-toolbar"
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      >
        {/* Floating Action Button */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              aria-label="Open toolbar"
              className="rounded-full bg-zinc-900 text-white shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mb-2"
            >
              <RelayKitLogo className="w-7 h-7" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            className="w-80 rounded-2xl shadow-2xl p-4 border border-border bg-popover mb-2"
          >
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-lg">John Doe</p>
                <p className="text-sm text-muted-foreground">
                  john.doe@example.com
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                variant={pinMode ? "default" : "secondary"}
                className="w-full justify-start gap-2"
                onClick={() => setPinMode((v) => !v)}
              >
                <PlusIcon />
                {pinMode ? "Pin mode active" : "Start pin mode"}
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start gap-2"
              >
                <ExitIcon />
                Turn off for this session
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start gap-2"
              >
                <LockClosedIcon />
                Login
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
