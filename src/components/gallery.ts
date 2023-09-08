import { Splide } from '@splidejs/splide';

import { queryElement } from '$utils/queryElement';

export const gallery = () => {
  const component = queryElement<HTMLElement>('.splide');
  if (!component) return;

  console.log(component);
  const slider = new Splide(component, {
    type: 'loop',
    autoWidth: true,
    pagination: false,
    arrows: false,
    gap: '2rem',
    breakpoints: {
      991: {
        gap: '1.25rem',
      },
      767: {
        gap: '0.875rem',
      },
    },
  });

  slider.mount();
};
