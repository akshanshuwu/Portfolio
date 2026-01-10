import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Work = () => {
  useGSAP(() => {
    function getScrollAmount() {
      const workFlex = document.querySelector(".work-flex") as HTMLElement;
      const workBox = document.querySelectorAll(".work-box");
      if (!workFlex || workBox.length === 0) return 0;

      // Calculate total width by summing all card widths
      let totalWidth = 0;
      workBox.forEach((box) => {
        totalWidth += (box as HTMLElement).offsetWidth;
      });

      // Get container styling
      const style = window.getComputedStyle(workFlex);
      const marginLeft = parseFloat(style.marginLeft) || 0;
      const paddingRight = parseFloat(style.paddingRight) || 0;
      
      // Total content width including margins
      const contentWidth = totalWidth + marginLeft + paddingRight;
      
      // Add 50px buffer to ensure card 4 content is fully visible
      // Works with the extra 200px padding on card 4
      const distance = contentWidth - window.innerWidth + 50;
      
      return Math.max(0, distance);
    }

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${getScrollAmount()}`,
        scrub: true,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: () => -getScrollAmount(),
      ease: "none",
    });

    // Refresh to ensure calculations are correct after render
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Clean up
    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {[...Array(4)].map((_value, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>Project Name</h4>
                    <p>Category</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>Javascript, TypeScript, React, Threejs</p>
              </div>
              <WorkImage image="/images/placeholder.webp" alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
