// Supplied campaign artwork is presentation-only, never a product gallery source.
export const campaignPhotos = {
  mountain: {
    src: '/images/campaign/mountain-ride.webp',
    alt: 'Campaign artwork of a helmeted rider on a winding mountain road',
    label: 'A new perspective',
  },
  openRoad: {
    src: '/images/campaign/open-road.webp',
    alt: 'Campaign artwork of a helmeted rider on an electric scooter',
    label: 'Find your direction',
  },
  cityMotion: {
    src: '/images/campaign/city-motion.webp',
    alt: 'Campaign artwork of a woman riding an electric scooter through the city',
    label: 'Your everyday, reimagined',
  },
  attitude: {
    src: '/images/campaign/electric-attitude.webp',
    alt: 'Campaign portrait of a helmeted rider seated on an electric scooter',
    label: 'A different attitude',
  },
  cityWalk: {
    src: '/images/campaign/city-walk.webp',
    alt: 'Campaign artwork of a rider walking beside a blue scooter',
    label: 'Your own pace',
  },
  coffee: {
    src: '/images/campaign/coffee-stop.webp',
    alt: 'Campaign artwork of friends meeting beside a scooter at a cafe',
    label: 'Room for the everyday',
  },
  cityPause: {
    src: '/images/campaign/city-pause.webp',
    alt: 'Campaign artwork of a rider beside an electric scooter on a city street',
    label: 'Your next stop',
  },
  direction: {
    src: '/images/campaign/next-direction.webp',
    alt: 'Campaign artwork of a rider and scooter among city buildings',
    label: 'A conversation starts here',
  },
  moments: {
    src: '/images/campaign/shared-moments.webp',
    alt: 'Campaign illustration of a parent and child beside an electric scooter',
    label: 'Shared moments',
  },
} as const

export type CampaignPhoto = (typeof campaignPhotos)[keyof typeof campaignPhotos]
