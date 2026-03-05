import Link from "next/link";

interface InfoButtonProps {
  href: string;
  text: string;
  className?: string;
  target?: string;
  rel?: string;
}

export default function InfoButton({
  href,
  text,
  className = "",
  target,
  rel,
}: InfoButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={`btn btn-outline-secondary text-lg ${className}`.trim()}>
      {text}
    </Link>
  );
}
