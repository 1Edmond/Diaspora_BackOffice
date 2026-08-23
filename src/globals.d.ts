declare module 'jsvectormap';
declare module 'jsvectormap/dist/maps/*.js';

declare module 'plyr' {
  export type PlyrOptions = {
    controls?: string[];
    autoplay?: boolean;
    muted?: boolean;
    loop?: { active: boolean };
  };

  export class Plyr {
    constructor(element: HTMLElement, options?: PlyrOptions);
    play(): void;
    pause(): void;
    stop(): void;
    togglePlay(): void;
    volume: number;
    muted: boolean;
  }

  export default Plyr;
}
