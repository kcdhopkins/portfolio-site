import React from "react";
import content from "../components/verbiage/content";
import WorkHistory from "../components/WorkHistory";

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
        <h2 className="mb-3 text-xl font-bold text-slate-50 sm:text-2xl">{title}</h2>
        <div className="leading-relaxed text-slate-400">{children}</div>
    </section>
);

const About: React.FC = () => {
    return (
        <main className="mx-auto max-w-4xl px-5 py-16">
            <div className="mb-12 text-center">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Resume
                </p>
                <h1 className="text-3xl font-bold text-slate-50 sm:text-4xl">About &amp; Experience</h1>
            </div>

            <div className="flex flex-col gap-6">
                <SectionCard title="About Me">
                    <p>{content.aboutMe}</p>
                </SectionCard>

                <SectionCard title="Technical Summary">
                    <p>{content.techSummary}</p>
                </SectionCard>

                <SectionCard title="Education">
                    <p>{content.education}</p>
                </SectionCard>

                <WorkHistory />
            </div>
        </main>
    );
};

export default About;
