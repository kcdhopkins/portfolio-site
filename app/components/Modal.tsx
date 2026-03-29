import Image from "next/image";
import Link from "next/link";
import React from "react";

type ModalProps = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const Modal: React.FC<ModalProps> = ({ setShowModal }) => {
    const styling = {
        fontWeight: 600,
        fontSize: "20px",
    }
    return (
        <main className="">
            <div className="modal-transparent-background" onClick={() => setShowModal(prev => !prev)}>
            </div>
            <div className="modal-content pad" style={{ maxWidth: "400px", minWidth: "200px" }}>
                <div className="close-button flex-r rw-reverse pad-b"><Image src="/close.png" alt="close" width={25} height={25} onClick={() => setShowModal(prev => !prev)} /></div>
                <hr style={{ fontWeight: 900 }} />
                <div>
                    <ul>
                        <Link href="/"><li className="pad-t" style={styling} onClick={() => setShowModal(prev => !prev)}>Home</li></Link>
                        <Link href="/about"><li className="pad-t" style={styling} onClick={() => setShowModal(prev => !prev)}>Experience</li></Link>
                        <Link href="/technology"><li className="pad-t" style={styling} onClick={() => setShowModal(prev => !prev)}>Technologies</li></Link>
                    </ul>
                </div>
                <div className="flex center-h pad-t" style={styling}>
                    Other Projects
                </div>
                <hr />
                <div>
                    <Link href="https://zen-torvalds-515ad2.netlify.app/"><li className="pad-t" style={styling} onClick={() => setShowModal(prev => !prev)}>Timezone Converter</li></Link>
                </div>
            </div>
        </main>
    );
}

export default Modal;