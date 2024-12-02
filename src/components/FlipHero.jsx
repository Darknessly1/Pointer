import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ReflectvComponent = () => {
    const containerRef = useRef(null);
    const replayRef = useRef(null);

    const startAnimations = () => {
        const container = containerRef.current;
        const panels = container.querySelectorAll(".panel");
        const fronts = container.querySelectorAll(".front");
        const backs = container.querySelectorAll(".back");
        const replayBtn = replayRef.current;

        const mirrorTL = gsap.timeline();
        const titleTL = gsap.timeline();

        gsap.set(replayBtn, { opacity: 0 });
        replayBtn.addEventListener("click", (e) => {
            mirrorTL.restart();
            titleTL.restart();
            gsap.to(e.target, 0.5, { opacity: 0 });
        });

        mirrorTL
            .to(fronts, { duration: 2.5, backgroundPosition: "30px 0px", ease: "expo.inOut" })
            .to(panels, { duration: 2.5, z: -300, rotationY: 180, ease: "expo.inOut" }, "-=2.3")
            .from(
                backs,
                {
                    duration: 2.5,
                    backgroundPosition: "-30px 0px",
                    ease: "expo.inOut",
                    onComplete: () => {
                        gsap.to(replayBtn, { duration: 1, opacity: 1 });
                    },
                },
                "-=2.3"
            );

        titleTL
            .to(".layer", { duration: 1, clipPath: "polygon(3% 0, 100% 0%, 100% 100%, 0% 100%)" })
            .to(".layer h1", { duration: 2, x: 400, ease: "expo.inOut" }, "-=0.5")
            .to(".cta", { duration: 2, x: 0, ease: "expo.inOut" }, "-=2");
    };

    useEffect(() => {
        startAnimations();
    }, []);

    return (
        <>
            <header className="header">
                <h4>REFLECTV</h4>
                <p>About</p>
                <p>Services</p>
                <p>Contact</p>
            </header>

            <div className="container" ref={containerRef}>
                {[...Array(4)].map((_, index) => (
                    <div className="panel" key={index}>
                        <div className="front"></div>
                        <div className="back"></div>
                    </div>
                ))}
            </div>

            <div className="layer">
                <h1>
                    WE<span>ARE</span>REFLECTV
                </h1>
                <div className="cta">
                    <p>Learn More</p>
                    <svg viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            <footer>
                <div className="replay" ref={replayRef}>
                    REPLAY
                </div>
                <p>
                    Based on this{" "}
                    <a href="https://dribbble.com/shots/3911960-Reflet-Communication" target="blank">
                        Dribble
                    </a>
                    . Not Responsive
                </p>
            </footer>
        </>
    );
};

export default ReflectvComponent;
