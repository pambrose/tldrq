export function fadeCollapse(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const height = element.offsetHeight;
    const style = element.style;

    // Set initial values for transition
    style.overflow = "hidden";
    style.height = `${height}px`;
    style.transition = "opacity 200ms ease-out, height 300ms ease-in-out 100ms, margin 300ms ease-in-out 100ms, padding 300ms ease-in-out 100ms";

    // Force reflow so the browser registers the starting values
    element.offsetHeight;

    // Animate to collapsed state
    style.opacity = "0";
    style.height = "0";
    style.marginTop = "0";
    style.marginBottom = "0";
    style.paddingTop = "0";
    style.paddingBottom = "0";

    element.addEventListener("transitionend", function handler(e) {
      if (e.propertyName === "height") {
        element.removeEventListener("transitionend", handler);
        resolve();
      }
    });
  });
}
