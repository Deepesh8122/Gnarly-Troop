type Props = {
  src: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-10 w-14",
  md: "h-12 w-16",
  lg: "h-16 w-24",
};

export default function AdminThumb({ src, alt = "", size = "md" }: Props) {
  return (
    <div
      className={`${sizes[size]} shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}
