import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Type for the 'attr' function
type AttrValue = string | number | boolean;

// Utility function to check and parse attribute value
const attr = (defaultVal: AttrValue, attrVal?: string): AttrValue => {
  const defaultValType = typeof defaultVal;

  if (!attrVal || attrVal.trim() === '') return defaultVal;
  if (attrVal === 'true' && defaultValType === 'boolean') return true;
  if (attrVal === 'false' && defaultValType === 'boolean') return false;
  if (isNaN(Number(attrVal)) && defaultValType === 'string') return attrVal;
  if (!isNaN(Number(attrVal)) && defaultValType === 'number') return Number(attrVal);

  return defaultVal;
};

// Main function for Scroll Flip
export const scrollFlip = (): void => {
  // Loop through each scrollflip component
  $("[tr-scrollflip-element='component']").each(function (this: Element, index: number) {
    const componentEl = $(this);
    const originEl = componentEl.find("[tr-scrollflip-element='origin']");
    const targetEl = componentEl.find("[tr-scrollflip-element='target']");
    const scrubStartEl = componentEl.find('[tr-scrollflip-scrubstart]');
    const scrubEndEl = componentEl.find('[tr-scrollflip-scrubend]');

    // Get settings from attributes
    const startSetting = attr('top top', scrubStartEl.attr('tr-scrollflip-scrubstart')) as string;
    const endSetting = attr('bottom bottom', scrubEndEl.attr('tr-scrollflip-scrubend')) as string;
    const staggerSpeedSetting = attr(0, componentEl.attr('tr-scrollflip-staggerspeed')) as number;
    const staggerDirectionSetting = attr(
      'start',
      componentEl.attr('tr-scrollflip-staggerdirection')
    ) as string;
    const scaleSetting = attr(false, componentEl.attr('tr-scrollflip-scale')) as boolean;
    const breakpointSetting = attr(0, componentEl.attr('tr-scrollflip-breakpoint')) as number;

    const componentIndex = index;
    let timeline: gsap.core.Timeline | null = null;
    let resizeTimer: number | null = null;

    // Assign matching data-flip-ids
    originEl.each(function (this: Element, index: number) {
      const flipId = `${componentIndex}-${index}`;
      $(this).attr('data-flip-id', flipId);
      targetEl.eq(index).attr('data-flip-id', flipId);
    });

    // Function to create the animation timeline
    const createTimeline = (): void => {
      if (timeline) {
        timeline.kill();
        gsap.set(targetEl, { clearProps: 'all' });
      }

      $('body').addClass('scrollflip-relative');

      gsap.matchMedia().add(`(min-width: ${breakpointSetting}px)`, function () {
        const state = Flip.getState(originEl);
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scrubStartEl,
            endTrigger: scrubEndEl,
            start: startSetting,
            end: endSetting,
            scrub: true,
          },
        });

        timeline.add(
          Flip.from(state, {
            targets: targetEl,
            scale: scaleSetting,
            stagger: { amount: staggerSpeedSetting, from: staggerDirectionSetting },
          })
        );
      });

      $('body').removeClass('scrollflip-relative');
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
  });
};
