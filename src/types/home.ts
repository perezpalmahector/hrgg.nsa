export type HomeQuote = {
  text: string;
  reference: string;
};

export type HomeHero = {
  title: string;
  subtitle: string;
  description: string;
  images: {
    desktop: string;
    mobile: string;
  };
};

export type HomeSong = {
  title: string;
  description: string;
  audio: string;
};

export type HomeData = {
  hero: HomeHero;
  quotes: HomeQuote[];
  song: HomeSong;
};
