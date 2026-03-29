import Image from "next/image";
import content from "./components/verbiage/content";
import Link from "next/link";

export default function Home() {
  return (
    <main className="height-100 flex center-vh">
      <div>
        <div className="flex-r center-h">
          <Image className="border-radius-circle" src="/profile-pic.jpg" alt="Logo" width={200} height={200} />
        </div>
        <div className="flex center-h" style={{ textAlign: "center", fontSize: "20px", fontWeight: 700 }}>
          {content.title}
        </div>
        <div className="mrg-l mrg-r paragraph-font-1" style={{ textAlign: "center" }}>
          {content.intro}
        </div>
        <div className="flex-r center-h ">
          <Link className="mrg-r" href="https://github.com/kcdhopkins" target="_blank">
            <Image src="/github.png" alt="github-img" width={50} height={50} />
          </Link>
          <Link href="https://www.linkedin.com/in/keyairius-hopkins-4b7b984a/" target="_blank">
            <Image src="/linked.png" alt="linkedin-mg" width={50} height={50} />
          </Link>
        </div>
      </div>
    </main>
  );
}
