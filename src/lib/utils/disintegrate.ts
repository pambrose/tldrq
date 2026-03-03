export function disintegrate(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const rect = element.getBoundingClientRect();
    const cols = 7;
    const rows = 4;

    // Create fixed overlay container matching the card's viewport position
    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: "50",
      pointerEvents: "none",
    });
    document.body.appendChild(container);

    // Hide the original card immediately
    element.style.opacity = "0";

    const colPct = 100 / cols;
    const rowPct = 100 / rows;
    const animations: Animation[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Each fragment is a full clone of the card, clip-pathed to one grid cell
        const fragment = element.cloneNode(true) as HTMLElement;
        Object.assign(fragment.style, {
          position: "absolute",
          top: "0",
          left: "0",
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          margin: "0",
          opacity: "1",
          clipPath: `inset(${r * rowPct}% ${(cols - c - 1) * colPct}% ${(rows - r - 1) * rowPct}% ${c * colPct}%)`,
          willChange: "transform, opacity",
        });
        container.appendChild(fragment);

        // Scatter direction biased outward from center
        const cx = (c + 0.5) / cols - 0.5;
        const cy = (r + 0.5) / rows - 0.5;
        const baseAngle = Math.atan2(cy, cx);
        const angle = baseAngle + (Math.random() - 0.5) * 1.2;
        const distance = 60 + Math.random() * 140;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 20;
        const rotate = (Math.random() - 0.5) * 60;
        const delay = Math.random() * 150;

        const anim = fragment.animate(
          [
            { transform: "translate(0,0) rotate(0deg) scale(1)", opacity: 1 },
            { transform: `translate(${tx}px,${ty}px) rotate(${rotate}deg) scale(0.3)`, opacity: 0 },
          ],
          {
            duration: 500 + Math.random() * 300,
            delay,
            easing: "cubic-bezier(0.4, 0, 0.8, 1)",
            fill: "forwards",
          },
        );
        animations.push(anim);
      }
    }

    Promise.all(animations.map((a) => a.finished)).then(() => {
      container.remove();
      resolve();
    });
  });
}
