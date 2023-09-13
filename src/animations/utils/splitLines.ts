import { SplitText } from 'gsap/SplitText';

export const splitLines = (element: Element | Element[], timeline: GSAPTimeline, delay: string) => {
  const formatted = new SplitText(element, {
    type: 'lines',
    linesClass: 'overflow-hidden',
  });

  timeline.from(
    formatted.lines,
    {
      translateY: '1rem',
      opacity: 0,
      stagger: 0.01,
    },
    delay
  );

  // formatted.lines.forEach((line, index) => {
  //   timeline.from(
  //     line.children,
  //     {
  //       translateY: '100%',
  //       // stagger: 0.01,
  //     },
  //     index === 0 ? delay : '<0.05'
  //   );
  // });
};
