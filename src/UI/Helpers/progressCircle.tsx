import React, { useEffect } from "react";
import "./progressCircle.css";

function ProgressCircles({ name, resources, icon }) {
  useEffect(() => {
    setTimeout(() => {
      const resourceCount = resources.length;
      const el = document.querySelector(`.circle-container.${name} ul`);
        if (el){
      Array.from(el.children).forEach((li, idx) => {
        const htmlli = li as HTMLElement
        const rot = (idx * 360) / resourceCount;
        htmlli.style.transform = `translate(-50%, -50%) rotate(${rot}deg) translateY(-3.7rem) rotate(-${rot}deg)`;
      });
    }
    }, 150);
  }, [resources, name]);

  return (
    <div className={`circle-container ${name}`}>
      <img src={icon} alt="an icon tag" />
      <ul className="resourceItems">
        {resources.map((p) => (
          <li>{p}</li>
        ))}
      </ul>
    </div>
  );
}
export default ProgressCircles;
