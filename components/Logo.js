import Link from "next/link";
import Image from "next/image";

export default function Logo({ href = "/", className = "" }) {
  return (
    <Link href={href} className={`focus-ring flex items-center gap-2.5 rounded ${className}`}>
      <Image
        src="/mockmate-logo.svg"
        alt="MockMate logo"
        width={30}
        height={30}
        className="shrink-0"
        priority
      />
      <span className="text-lg font-semibold tracking-tight text-paper">
        Mock<span className="text-brand">Mate</span>
      </span>
    </Link>
  );
}
