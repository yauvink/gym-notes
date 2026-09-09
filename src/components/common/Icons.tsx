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
