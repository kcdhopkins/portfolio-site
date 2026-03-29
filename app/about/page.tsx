import Image from "next/image";
import Link from "next/link";
import React from "react";
import content from "../components/verbiage/content";
import WorkHistory from "../components/WorkHistory";

const Home: React.FC = () => {

    return (
        <div className="flex center-h">
            <main className="pad-lr" style={{ maxWidth: "1020px" }}>
                <div>
                    <div className="pad-b pad-t">
                        <div className="font-bold-1 ">About Me</div>
                        <div className="paragraph-font-1">{content.aboutMe}</div>
                    </div>
                    <hr />
                    <div className="pad-b pad-t">
                        <div className="font-bold-1">Technical Summary</div>
                        <div className="paragraph-font-1">{content.techSummary}</div>
                    </div>
                    <hr />
                    <div className="pad-b pad-t">
                        <div className="font-bold-1">Education</div>
                        <div>{content.education}</div>
                    </div>
                    <hr />
                    <WorkHistory />
                </div>
            </main>
        </div>

    );
}

export default Home;