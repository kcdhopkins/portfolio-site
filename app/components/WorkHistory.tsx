import { useMemo } from "react";
import content from "./verbiage/content";

const WorkHistory = () => {

    const history = useMemo(() => {

        return content.workHistory.map(({ company, dates, title, responsibilities }, index) => {

            return <div key={`workhistory-${index}`}>
                <div className="flex-r s-between">
                    <div style={{ fontWeight: "bold" }}>{company}</div>
                    <div className="flex-r justify-end paragraph-font-1">
                        {dates}
                    </div>
                </div>
                <hr />
                <div>
                    <div style={{ fontWeight: "bold" }}>{title}</div>
                    <div className="mrg-l">
                        <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
                            {responsibilities.map((task, index) => {
                                return <li className="paragraph-font-1" key={`task-${index}`}>
                                    {task}
                                </li>
                            })}
                        </ul>
                    </div>
                </div>

                <hr />
            </div>
        })
    }, [])

    return <main>
        <div className="flex-c center-v">
            <div className="font-bold-1">
                Technical Experience
            </div>
        </div>
        <div className="pad-t">
            {history}
        </div>
    </main>
}

export default WorkHistory;