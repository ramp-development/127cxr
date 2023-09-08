import Splide from '@splidejs/splide';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

import { splitLines } from './utils';

export const scroll = () => {
  const track = queryElement<HTMLDivElement>('.page-track');
  if (!track) return;
  const sticky = queryElement<HTMLDivElement>('.page-sticky', track);
  if (!sticky) return;

  // hero components
  const heroAttr = 'data-hero';
  const hero = queryElement<HTMLDivElement>(`[${heroAttr}="component"]`, sticky);
  const heroLeftSVGs = queryElements<HTMLImageElement>(`[${heroAttr}="svg-left"]`, hero);
  const heroCenterSVGs = queryElements<HTMLImageElement>(`[${heroAttr}="svg-center"]`, hero);
  const heroRightSVGs = queryElements<HTMLImageElement>(`[${heroAttr}="svg-right"]`, hero);
  const heroTitle = queryElement<HTMLHeadingElement>(`[${heroAttr}="title"]`, hero);
  const heroSub = queryElement<HTMLHeadingElement>(`[${heroAttr}="sub"]`, hero);
  // if (!hero || !heroLeftSVGs || !heroCenterSVGs || !heroRightSVGs || !heroTitle || !heroSub) return;

  // info components
  const infoAttr = 'data-info';
  const info = queryElement<HTMLDivElement>(`[${infoAttr}="component"]`, sticky);
  const infoTitle = queryElement<HTMLHeadingElement>(`[${infoAttr}="title"]`, info);
  const infoSub = queryElement<HTMLHeadingElement>(`[${infoAttr}="sub"]`, info);
  const infoLeftChevron = queryElement<HTMLImageElement>(`[${infoAttr}="chevron-left"]`, info);
  const infoRightChevron = queryElement<HTMLImageElement>(`[${infoAttr}="chevron-right"]`, info);
  const infoCross = queryElement<HTMLImageElement>(`[${infoAttr}="cross"]`, info);
  // if (!info || !infoTitle || !infoSub || !infoLeftChevron || !infoRightChevron || !infoCross)
  //   return;

  // gallery components
  const galleryAttr = 'data-gallery';
  const gallery = queryElement<HTMLDivElement>(`[${galleryAttr}="component"]`, sticky);
  const gallerySlider = queryElement<HTMLDivElement>(`[${galleryAttr}="slider"]`, gallery);
  // const gallerySlider = queryElement<HTMLDivElement>(`[${galleryAttr}="slider"]`, gallery);
  // if (!gallery || !gallerySlider) return;

  // footer components
  const footerAttr = 'data-footer';
  const footer = queryElement<HTMLDivElement>(`[${footerAttr}="component"]`);
  const footerTitle = queryElement<HTMLHeadingElement>(`[${footerAttr}="title"]`, footer);
  const footerPartners = queryElements<HTMLDivElement>(`[${footerAttr}="partner"]`, footer);
  const footerChevron1 = queryElement<HTMLDivElement>(`[${footerAttr}="chevron1"]`, footer);
  const footerChevron2 = queryElement<HTMLDivElement>(`[${footerAttr}="chevron2"]`, footer);
  const footerCross = queryElement<HTMLDivElement>(`[${footerAttr}="cross"]`, footer);
  const partnerAttr = 'data-partner';
  // if (
  //   !footer ||
  //   !footerTitle ||
  //   !footerPartners ||
  //   !footerChevron1 ||
  //   !footerChevron2 ||
  //   !footerCross
  // )
  //   return;

  let masterTl: gsap.core.Timeline | null = null,
    footerTl: gsap.core.Timeline | null = null,
    resizeTimer: number | null = null;

  const createMasterTimeline = (): void => {
    if (masterTl) masterTl.kill();

    const heroTl = () => {
      if (!hero) return;
      const timeline = gsap.timeline();
      timeline.to(hero, { opacity: 0, duration: 0.75 });
      return timeline;
    };

    const infoTl = () => {
      if (!info || !infoCross || !infoTitle || !infoSub || !infoLeftChevron || !infoRightChevron)
        return;
      const timeline = gsap
        .timeline({
          onStart: () => {
            info.style.display = 'flex';
          },
          onReverseComplete: () => {
            info.style.removeProperty('display');
          },
        })
        .to(info, { opacity: 1 })
        .from(infoCross, { scale: 1.5 }, '<')
        .from(infoLeftChevron, { xPercent: -100 }, '<')
        .from(infoRightChevron, { xPercent: 100 }, '<');

      splitLines(infoTitle, timeline, '<');
      splitLines(infoSub, timeline, '<0.1');

      timeline.to(info, { opacity: 0, duration: 0.75 });

      return timeline;
    };

    const galleryTl = () => {
      if (!gallery || !gallerySlider) return;
      const timeline = gsap
        .timeline({
          onStart: () => {
            gallery.style.display = 'flex';
          },
          onReverseComplete: () => {
            gallery.style.removeProperty('display');
          },
        })
        .to(gallery, { opacity: 1 })
        .from(gallerySlider, { xPercent: 10 }, '<');
      return timeline;
    };

    const mm = gsap.matchMedia();

    mm.add('(min-width: 992px)', () => {
      masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      masterTl.add(heroTl()).add(infoTl(), '>-0.25').add(galleryTl(), '>-0.25');
    });

    gsap.matchMedia().add(`(min-width: 992px)`, function () {});
  };

  const createFooterTimeline = (): void => {
    if (footerTl) footerTl.kill();

    gsap.matchMedia().add(`(min-width: 992px)`, function () {
      if (
        !footer ||
        !footerTitle ||
        !footerPartners ||
        !footerChevron1 ||
        !footerChevron2 ||
        !footerCross
      )
        return;
      footerTl = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      footerTl
        .from(footerChevron1, { xPercent: -100, scale: 1.5 })
        .from(footerChevron2, { xPercent: -90, scale: 1.5 }, '<')
        .from(footerCross, { xPercent: 100, scale: 1.5 }, '<');

      splitLines(footerTitle, footerTl, '>');

      footerPartners.forEach((partner, index) => {
        const partnerTitle = queryElement<HTMLHeadingElement>(`[${partnerAttr}="title"]`, partner);
        const partnerLine = queryElement<HTMLDivElement>(`[${partnerAttr}="line"]`, partner);
        const partnerLogo = queryElement<HTMLImageElement>(`[${partnerAttr}="logo"]`, partner);
        const partnerContacts = queryElements<HTMLDivElement>(
          `[${partnerAttr}="contact"]`,
          partner
        );

        const partnerTl = () => {
          const timeline = gsap.timeline();

          if (partnerTitle) timeline.from(partnerTitle, { yPercent: 100 });
          if (partnerLine) timeline.from(partnerLine, { width: 0 }, '<');
          if (partnerLogo) timeline.from(partnerLogo, { x: '1rem', opacity: 0 }, '<0.1');
          if (partnerContacts.length > 0) {
            timeline.from(partnerContacts, { x: '1rem', opacity: 0, stagger: 0.1 }, '<0.1');
          }

          return timeline;
        };

        footerTl.add(partnerTl(), index === 0 ? '<' : '<0.1');
      });
    });
  };

  // Create initial timelines
  createMasterTimeline();
  createFooterTimeline();

  // Update the timeline on window resize
  window.addEventListener('resize', function () {
    if (resizeTimer !== null) {
      clearTimeout(resizeTimer);
    }

    resizeTimer = setTimeout(() => {
      createMasterTimeline();
      createFooterTimeline();
    }, 250);
  });
};
