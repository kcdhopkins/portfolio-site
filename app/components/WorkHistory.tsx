import { useMemo } from "react";
import content from "./verbiage/content";

const WorkHistory = () => {
    const history = useMemo(() => {
        const total = content.workHistory.length;

        return content.workHistory.map(({ company, dates, title, responsibilities, current }, index) => (
            <div key={`workhistory-${index}`} className="relative pl-8 sm:pl-10">
                <span
                    className={`absolute left-0 top-1.5 h-3 w-3 rounded-full ring-4 ring-slate-950 ${current ? "bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]" : "bg-slate-600"
                        }`}
                />
                {index !== total - 1 && (
                    <span className="absolute left-[5px] top-5 h-[calc(100%_+_2rem)] w-px bg-slate-800" />
                )}

                <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-slate-50">{company}</h3>
                        <div className="flex items-center gap-2">
                            {current && (
                                <span className="rounded-full bg-cyan-400/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                                    Current
                                </span>
                            )}
                            <span className="rounded-full border border-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                                {dates}
                            </span>
                        </div>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-blue-300">{title}</p>
                    <ul className="mt-4 flex flex-col gap-2">
                        {responsibilities.map((task, i) => (
                            <li key={`task-${i}`} className="flex gap-2 text-sm leading-relaxed text-slate-400">
                                <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-slate-600" />
                                {task}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        ));
    }, []);

    return (
        <section>
            <h2 className="mb-6 text-xl font-bold text-slate-50 sm:text-2xl">Technical Experience</h2>
            <div className="relative">{history}</div>
        </section>
    );
};

export default WorkHistory;
