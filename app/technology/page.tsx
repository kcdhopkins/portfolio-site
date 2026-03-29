import TechBadges from "../components/TechBadges";
import content from "../components/verbiage/content";

const Home: React.FC = () => {

    return (
        <main className="pad" >
            <div className="flex-c center-v">
                <div style={{ maxWidth: "1020px" }}>
                    <div className="flex-r center-h">
                        <div className="font-bold-1">Technologies</div>
                    </div>
                    <div>
                        <div className="paragraph-font-1">{content.technology}</div>
                    </div>
                    <div className="pad-t">
                        <TechBadges />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Home;