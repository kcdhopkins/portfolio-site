import TechBadges from "../components/TechBadges";
import content from "../components/verbiage/content";

const Technology: React.FC = () => {
    return (
        <main className="mx-auto max-w-4xl px-5 py-16">
            <div className="mb-10 text-center">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Skills &amp; Tools
                </p>
                <h1 className="text-3xl font-bold text-slate-50 sm:text-4xl">Technologies</h1>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
                    {content.technology}
                </p>
            </div>
            <TechBadges />
        </main>
    );
};

export default Technology;
