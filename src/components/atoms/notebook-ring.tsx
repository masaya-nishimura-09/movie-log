type NotebookRingProps = {
  variant: "spread" | "edge";
};

export function NotebookRing({ variant }: NotebookRingProps) {
  if (variant === "edge") {
    return (
      <svg
        width="50"
        height="16"
        viewBox="0 0 50 16"
        fill="none"
        strokeLinecap="round"
        aria-hidden="true"
        className="block"
      >
        <circle
          cx="42"
          cy="8"
          r="4.2"
          fill="#8b5e3c"
          stroke="#6b4630"
          strokeWidth="0.7"
        />
        <path
          d="M5 8 H42"
          stroke="#5a3d28"
          strokeWidth="4.9"
          transform="translate(0,1.4)"
        />
        <path d="M5 8 H42" stroke="#c9a46a" strokeWidth="4.9" />
        <path d="M9 6.7 H38" stroke="#f1dcb4" strokeWidth="1.1" />
      </svg>
    );
  }
  return (
    <svg
      width="78"
      height="28"
      viewBox="0 0 112 40"
      fill="none"
      strokeLinecap="round"
      aria-hidden="true"
      className="block"
    >
      <circle
        cx="18"
        cy="20"
        r="6"
        fill="#8b5e3c"
        stroke="#6b4630"
        strokeWidth="1"
      />
      <circle
        cx="94"
        cy="20"
        r="6"
        fill="#8b5e3c"
        stroke="#6b4630"
        strokeWidth="1"
      />
      <path
        d="M18 20 H94"
        stroke="#5a3d28"
        strokeWidth="7"
        transform="translate(0,2)"
      />
      <path d="M18 20 H94" stroke="#c9a46a" strokeWidth="7" />
      <path d="M24 18 H88" stroke="#f1dcb4" strokeWidth="1.6" />
    </svg>
  );
}
