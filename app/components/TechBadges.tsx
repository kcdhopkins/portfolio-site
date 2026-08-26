import { useMemo } from "react";
import Image from "next/image";
import content from "./verbiage/content";

const TechBadges: React.FC = () => {
    const tech = useMemo(() => {
        return content.techbadge.map(({ name, icon }, index) => (
            <div
                key={`badge-${index}`}
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 transition hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-slate-900/70"
            >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/95">
                    <Image src={icon} alt={name} width={18} height={18} />
                </span>
                <span className="text-sm font-medium text-slate-200">{name}</span>
            </div>
        ));
    }, []);

    return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{tech}</div>;
};

export default TechBadges;
