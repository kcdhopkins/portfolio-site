import Image from "next/image";
import content from "./components/verbiage/content";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5 py-16">
      <div className="glow-blob left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 bg-blue-600/30" />
      <div className="glow-blob bottom-0 right-1/4 h-[300px] w-[300px] bg-cyan-500/20" />

      <div className="animate-fade-up relative z-10 flex max-w-2xl flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-1.5 text-xs font-medium text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
          Open to new opportunities
        </span>

        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 opacity-40 blur-xl" />
          <Image
            className="relative rounded-full ring-4 ring-slate-800"
            src="/profile-pic.jpg"
            alt="Keyairius Hopkins"
            width={168}
            height={168}
            priority
          />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Keyairius Hopkins
        </h1>
        <p className="mt-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-lg font-semibold text-transparent sm:text-xl">
          {content.title}
        </p>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
          {content.intro}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`mailto:${content.email}`}
            className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40"
          >
            Get in Touch
          </Link>
          <Link
            href="/resume.pdf"
            target="_blank"
            download
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M4 19h16" />
            </svg>
            Download Resume
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            View Experience
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="https://github.com/kcdhopkins"
            target="_blank"
            aria-label="GitHub"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Image src="/github.png" alt="GitHub" width={22} height={22} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/keyairius-hopkins-4b7b984a/"
            target="_blank"
            aria-label="LinkedIn"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Image src="/linked.png" alt="LinkedIn" width={22} height={22} />
          </Link>
        </div>
      </div>
    </main>
  );
}
