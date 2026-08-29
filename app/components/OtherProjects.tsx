import Link from "next/link";
import content from "./verbiage/content";

const OtherProjects = () => {
    return (
        <section className="border-t border-slate-800/70">
            <div className="mx-auto w-full max-w-4xl px-5 pb-20 pt-16">
                <div className="mb-8 text-center">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                        Side Projects
                    </p>
                    <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl">Other Projects</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {content.otherProjects.map(({ name, href }, index) => (
                        <Link
                            key={`project-${index}`}
                            href={href}
                            target="_blank"
                            className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-slate-900/70"
                        >
                            <span className="text-base font-semibold text-slate-100 transition-colors group-hover:text-cyan-300">
                                {name}
                            </span>
                            <svg
                                viewBox="0 0 24 24"
                                width={18}
                                height={18}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="flex-shrink-0 text-slate-500 transition-colors group-hover:text-cyan-300"
                            >
                                <path d="M7 17L17 7" />
                                <path d="M7 7h10v10" />
                            </svg>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OtherProjects;
