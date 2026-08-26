import Image from "next/image";
import Link from "next/link";
import content from "./verbiage/content";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-800/70 bg-slate-950">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 py-10 text-center">
                <div className="flex items-center gap-4">
                    <Link
                        href="https://github.com/kcdhopkins"
                        target="_blank"
                        aria-label="GitHub"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        <Image src="/github.png" alt="GitHub" width={20} height={20} />
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/keyairius-hopkins-4b7b984a/"
                        target="_blank"
                        aria-label="LinkedIn"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        <Image src="/linked.png" alt="LinkedIn" width={20} height={20} />
                    </Link>
                    <Link
                        href={`mailto:${content.email}`}
                        aria-label="Email"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        <Image src="/email.svg" alt="Email" width={18} height={18} />
                    </Link>
                </div>
                <p className="text-sm text-slate-500">{content.email}</p>
                <p className="text-xs text-slate-600">
                    © {year} Keyairius Hopkins. Built with Next.js &amp; Tailwind CSS.
                </p>
            </div>
        </footer>
    );
}
