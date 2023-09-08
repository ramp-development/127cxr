import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { queryElement } from '$utils/queryElement';

// Main function for Scroll Flip
export const scrollFlip = (): void => {
  const attr = 'data-scroll';
  const logoStart = queryElement<HTMLElement>(`[${attr}="logo-start"]`);
  const logoEnd = queryElement<HTMLElement>(`[${attr}="logo-end"]`);
  if (!logoStart || !logoEnd) return;

  let timeline: gsap.core.Timeline | null = null,
    resizeTimer: number | null = null;

  // Function to create the animation timeline
  const createTimeline = (): void => {
    if (timeline) timeline.kill();

    gsap.matchMedia().add(`(min-width: 992px)`, function () {
      const state = Flip.getState(logoStart);

      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: `+=${window.innerHeight}px`,
          scrub: true,
        },
      });

      timeline.add(
        Flip.from(state, {
          targets: logoEnd,
        })
      );
    });
  };

  // Create initial timeline
  createTimeline();

  // Update the timeline on window resize
  window.addEventListener('resize', function () {
    if (resizeTimer !== null) {
      clearTimeout(resizeTimer);
    }

    resizeTimer = setTimeout(() => {
      createTimeline();
    }, 250);
  });
};
