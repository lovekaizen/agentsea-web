// The heart from the lovekaizen logo (agency-web/apps/web/src/components/logo.tsx).
// Reusable across lovekaizen sites: copy this file, or move it to a shared package.
// Fills with currentColor, so set the colour with a Tailwind text-* class.

export function HeartMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0.9 12.5 134 117"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M98.36,12.57c-9.64,0-18.88,3.82-25.71,10.65l-3.01,3.01-3.01-3.01c-6.83-6.83-16.07-10.65-25.71-10.65s-18.88,3.82-25.71,10.65C.94,37.48.94,60.58,15.2,74.84l51.22,51.22,3.21,3.21h0l3.21-3.01,24.1-24.1v6.63c0,3.62,2.81,6.43,6.43,6.43s6.43-2.81,6.43-6.43v-27.32c0-3.62-2.81-6.43-6.43-6.43h-24.91c-3.62,0-6.43,2.81-6.43,6.43s2.81,6.43,6.43,6.43h3.21l-12.25,12.25-25.11-25.11-3.21-3.21h0l-11.45-11.45c-6.03-6.23-6.03-16.07,0-22.3,3.01-3.01,7.03-4.62,11.05-4.62s8.24,1.61,11.05,4.62l14.46,14.46,3.41,3.41,2.41-2.61.8-.8,14.26-14.26c3.01-3.01,6.83-4.62,11.05-4.62s8.24,1.61,11.05,4.62,4.62,7.03,4.62,11.05-1.61,8.24-4.62,11.05l-5.62,5.62-.4.4-3.82,3.41h9.04c3.62,0,6.43,2.81,6.43,6.43v7.63l9.24-9.04c6.83-6.83,10.65-16.07,10.65-25.71s-3.82-18.88-10.65-25.71c-6.83-6.83-16.07-10.65-25.71-10.65h0v-.2h0Z"
      />
    </svg>
  );
}

export const LOVEKAIZEN_URL = 'https://lovekaizen.com';
