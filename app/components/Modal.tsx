"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import content from "./verbiage/content";

type ModalProps = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "Experience" },
    { href: "/technology", label: "Technologies" },
];

const Modal: React.FC<ModalProps> = ({ setShowModal }) => {
    const pathname = usePathname();
    const close = () => setShowModal(false);

    if (typeof document === "undefined") return null;

    // Portaled to <body> because the header uses backdrop-blur, which creates a CSS
    // containing block for fixed-position descendants — without the portal, this
    // drawer would be clipped to the header's box instead of the full viewport.
    return createPortal(
        <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={close} />
            <div className="animate-slide-in absolute right-0 top-0 flex h-full w-[80%] max-w-[320px] flex-col border-l border-slate-800 bg-slate-950 px-6 py-6 shadow-2xl">
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Close menu"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700"
                    >
                        <Image src="/close.png" alt="" width={14} height={14} className="invert" />
                    </button>
                </div>

                <nav className="mt-8 flex flex-col gap-1">
                    {LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={close}
                            className={`rounded-xl px-4 py-3 text-lg font-semibold transition-colors ${pathname === href
                                    ? "bg-slate-800 text-cyan-300"
                                    : "text-slate-200 hover:bg-slate-900"
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-6 flex flex-col gap-2">
                    <Link
                        href="/resume.pdf"
                        target="_blank"
                        download
                        onClick={close}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200"
                    >
                        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3v12" />
                            <path d="M7 10l5 5 5-5" />
                            <path d="M4 19h16" />
                        </svg>
                        Download Resume
                    </Link>
                    <Link
                        href={`mailto:${content.email}`}
                        onClick={close}
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950"
                    >
                        Contact Me
                    </Link>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
