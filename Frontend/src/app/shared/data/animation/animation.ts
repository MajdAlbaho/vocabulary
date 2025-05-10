import {
  trigger,
  transition,
  style,
  query,
  group,
  animateChild,
  animate,
  keyframes,
  animation,
} from '@angular/animations';
export const transAnimation = animation([
  style({
    height: '{{ height }}',
    opacity: '{{ opacity }}',
    backgroundColor: '{{ backgroundColor }}',
  }),
  animate('{{ time }}'),
]);

// Routable animations
export const slideInAnimation = trigger('routeAnimations', [
  transition('HomePage <=> AboutPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ left: '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('300ms ease-out', style({ left: '100%' }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))]),
    ]),
    query(':enter', animateChild()),
  ]),
  transition('* <=> FilterPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ left: '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '100%' }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))]),
    ]),
    query(':enter', animateChild()),
  ]),
]);

export const fader = trigger('routeAnimations', [
  transition('* <=> *', [
    // Set a default  style for enter and leave
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          opacity: 1,
          transform: 'scale(0) translateY(100%)',
        }),
      ],
      { optional: true }
    ),
    // Animate the new page in
    query(
      ':enter',
      [
        animate(
          '800ms ease',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        ),
      ],
      { optional: true }
    ),
  ]),
]);

export const slider = trigger('routeAnimations', [
  transition('* => isLeft', slideTo('left')),
  transition('* => isRight', slideTo('right')),
  transition('* => isTop', slideTo('top')),
  transition('isRight => *', slideTo('left')),
]);

function slideTo(direction: any) {
  const optional = { optional: true };
  return [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          [direction]: 0,
          width: '100%',
        }),
      ],
      optional
    ),
    query(':enter', [style({ [direction]: '-100%' })]),
    group([
      query(
        ':leave',
        [animate('800ms ease', style({ [direction]: '100%' }))],
        optional
      ),
      query(':enter', [animate('800ms ease', style({ [direction]: '0%' }))]),
    ]),
    // Normalize the page style... Might not be necessary

    // Required only if you have child animations on the page
    // query(':leave', animateChild()),
    // query(':enter', animateChild()),
  ];
}
