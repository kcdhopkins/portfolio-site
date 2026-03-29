import { useMemo } from "react";
import Image from "next/image";
import content from "./verbiage/content";
const TechBadges: React.FC = () => {

    const tech = useMemo(() => {
        return content.techbadge.map(({ name, icon }, index) => {
            return (
                <div className="bg-white rounded-lg w-30 mr-2 flex-r center-v justify-between mb-2 pad" key={`badge-${index}`}>
                    <div className="">{name}</div>
                    <div className=""><Image src={icon} alt="Picture of the author" width={25} height={25} /></div>
                </div>
            )
        })
    }, [content.techbadge])

    return (
        <div className="pad-t flex-r flex-wrp center-vh">
            {tech}
        </div>)
}

export default TechBadges;