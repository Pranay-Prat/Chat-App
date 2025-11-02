const AuthImagePattern = () => {
  return (
    <div className="hidden lg:flex relative items-center justify-center bg-base-200 p-12 overflow-hidden">
      {/* background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-24 w-[28rem] h-[28rem] rounded-full bg-secondary/20 blur-3xl"
      />

      {/* dotted grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          color: "rgb(160 160 160)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      />

      <div className="relative max-w-md w-full">
        {/* glass chat preview card */}
        <div className="mx-auto w-[22rem] rounded-3xl border border-base-300/50 bg-base-100/60 backdrop-blur shadow-xl">
          {/* header bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-base-300/50">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-error/70" />
              <span className="size-2.5 rounded-full bg-warning/70" />
              <span className="size-2.5 rounded-full bg-success/70" />
            </div>
            <div className="ml-auto h-2.5 w-16 rounded bg-base-300/70" />
          </div>
          {/* conversation */}
          <div className="px-4 py-4 space-y-3">
            {/* incoming */}
            <div className="flex items-start gap-2">
              <div className="size-8 rounded-full bg-primary/20 border border-primary/20" />
              <div className="max-w-[70%] rounded-2xl rounded-tl-sm bg-base-300/70 px-3 py-2 text-sm text-base-content/80">
                Hey there! Welcome to Chat-App 👋
              </div>
            </div>
            {/* outgoing */}
            <div className="flex items-start gap-2 justify-end">
              <div className="max-w-[70%] rounded-2xl rounded-tr-sm bg-primary/90 text-primary-content px-3 py-2 text-sm shadow-sm">
                Thanks! Excited to get started.
              </div>
              <div className="size-8 rounded-full bg-primary/30 border border-primary/30" />
            </div>
            {/* incoming */}
            <div className="flex items-start gap-2">
              <div className="size-8 rounded-full bg-primary/20 border border-primary/20" />
              <div className="max-w-[70%] rounded-2xl rounded-tl-sm bg-base-300/70 px-3 py-2 text-sm text-base-content/80">
                Your messages sync in real-time. Dark mode included.
              </div>
            </div>
            {/* typing indicator */}
            <div className="flex items-start gap-2">
              <div className="size-8 rounded-full bg-primary/20 border border-primary/20" />
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-base-300/70 px-3 py-2">
                <span className="size-1.5 rounded-full bg-base-content/50 animate-pulse" />
                <span className="size-1.5 rounded-full bg-base-content/50 animate-pulse [animation-delay:120ms]" />
                <span className="size-1.5 rounded-full bg-base-content/50 animate-pulse [animation-delay:240ms]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;