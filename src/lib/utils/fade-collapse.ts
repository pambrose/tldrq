export function fadeCollapse(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const height = element.offsetHeight;
    const style = element.style;

    // Phase 1: Slide off to the right
    style.transition = "transform 300ms ease-in, opacity 300ms ease-in";
    style.overflow = "hidden";
    style.height = `${height}px`;

    // Force reflow
    element.offsetHeight;

    style.transform = "translateX(100%)";
    style.opacity = "0";

    element.addEventListener("transitionend", function slideHandler(e) {
      if (e.propertyName !== "transform") return;
      element.removeEventListener("transitionend", slideHandler);

      // Phase 2: Collapse the gap
      style.transition = "height 250ms ease-in-out, margin 250ms ease-in-out, padding 250ms ease-in-out";

      element.offsetHeight;

      style.height = "0";
      style.marginTop = "0";
      style.marginBottom = "0";
      style.paddingTop = "0";
      style.paddingBottom = "0";

      element.addEventListener("transitionend", function collapseHandler(e) {
        if (e.propertyName === "height") {
          element.removeEventListener("transitionend", collapseHandler);
          resolve();
        }
      });
    });
  });
}
