export function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.6"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 5H5M10 5H5M5 5V0M5 5V10" />
    </svg>
  );
}

export function ExportIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 4v10" />
      <path d="M8.2 8.2 12 4.4l3.8 3.8" />
      <path d="M5 15.6V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2.4" />
    </svg>
  );
}

export function ImportIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 14.4V4.4" />
      <path d="M8.2 10.2 12 14l3.8-3.8" />
      <path d="M5 15.6V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2.4" />
    </svg>
  );
}

export function AppleIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.6 12.7c.05-2.35 1.92-3.48 2-3.53-1.1-1.61-2.8-1.83-3.4-1.86-1.45-.15-2.83.85-3.56.85-.73 0-1.86-.83-3.06-.81-1.57.02-3.02.92-3.83 2.33-1.64 2.84-.42 7.04 1.17 9.35.78 1.13 1.71 2.4 2.93 2.35 1.18-.05 1.62-.76 3.04-.76s1.82.76 3.06.74c1.27-.02 2.07-1.15 2.84-2.29.9-1.3 1.26-2.56 1.28-2.63-.03-.01-2.45-.94-2.47-3.74z" />
      <path d="M14.7 6.2c.64-.78 1.07-1.86.95-2.95-0.92.04-2.03.62-2.69 1.39-.59.69-1.1 1.8-.96 2.86 1.02.08 2.06-.52 2.7-1.3z" />
    </svg>
  );
}

export function MinusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.6"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 5H10" />
    </svg>
  );
}

export function ShareIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 14V4" />
      <path d="M8.2 7.2 12 3.4l3.8 3.8" />
      <path d="M6 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8" />
    </svg>
  );
}

export function DoneIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...props}>
      <circle cx="12" cy="12" r="10" fill="#2F9E6B" />
      <path
        d="M7.6 12.2 10.5 15.1 16.5 8.8"
        fill="none"
        stroke="#F7F8F4"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
