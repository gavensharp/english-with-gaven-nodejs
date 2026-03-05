import Link from "next/link";

interface CTAButtonProps {
  href?: string;
  text?: string;
  className?: string;
}

export default function CTAButton({
  href = "/signup",
  text = "Get Started",
  className = "",
}: CTAButtonProps) {
  return (
    <Link
      href={href}
      className={`btn btn-outline-primary text-lg ${className}`.trim()}>
      {text}
    </Link>
  );
}
