'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import content from './verbiage/content'
import Modal from "./Modal";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "Experience" },
    { href: "/technology", label: "Technology" },
];

export default function Header() {
    const [showModal, setShowModal] = useState(false);
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
                <Link href="/" className="group flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold text-slate-950 shadow-[0_0_20px_-4px_rgba(34,211,238,0.6)]">
                        KH
                    </span>
                    <span className="hidden text-sm font-semibold tracking-wide text-slate-100 transition-colors group-hover:text-cyan-300 sm:block">
                        Keyairius Hopkins
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${active
                                        ? "bg-slate-800/80 text-cyan-300"
                                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                                    }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        href="/resume.pdf"
                        target="_blank"
                        download
                        className="hidden items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-400 hover:text-cyan-300 sm:inline-flex"
                    >
                        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3v12" />
                            <path d="M7 10l5 5 5-5" />
                            <path d="M4 19h16" />
                        </svg>
                        Resume
                    </Link>
                    <Link
                        href={`mailto:${content.email}`}
                        className="hidden rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:shadow-lg hover:shadow-cyan-500/30 sm:inline-flex"
                    >
                        Contact
                    </Link>
                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => setShowModal((prev) => !prev)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 md:hidden"
                    >
                        <Image src="/hamburger-menu.svg" alt="" width={18} height={18} className="invert" />
                    </button>
                </div>
            </div>
            {showModal && <Modal setShowModal={setShowModal} />}
        </header>
    );
}
