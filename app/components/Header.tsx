'use client'
import Image from "next/image";
import content from './verbiage/content'
import Modal from "./Modal";
import { useState } from "react";
export default function Header() {
    const [showModal, setShowModal] = useState(false);
    return (
        <main >
            <div className="pad">
                <div className="flex s-between">
                    <div className="">
                        <div className="flex-r">
                            <Image className="hide-small-screen" src="/email.svg" alt="Logo" width={50} height={50} />
                            <div className="center-vh" style={{ fontWeight: 600, fontSize: "18px" }}>
                                {content.email}
                            </div>
                        </div>
                    </div>
                    <div className="center-vh" >
                        <Image src="/hamburger-menu.svg" alt="Logo" width={30} height={30} onClick={() => setShowModal(prev => !prev)} />
                    </div>
                </div>
                <div className="border"></div>
            </div>
            {showModal && <Modal setShowModal={setShowModal} />}
        </main>
    );
}