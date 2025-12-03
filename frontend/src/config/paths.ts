export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  app: {
    root: {
      path: '/leaderboard',
      getHref: () => '/leaderboard',
    },
    points: {
      path: '/leaderboard/analysis',
      getHref: () => '/leaderboard/analysis',
    },
    heatmap: {
      path: '/leaderboard/matrix',
      getHref: () => '/leaderboard/matrix',
    },
    delta: {
      path: '/leaderboard/delta',
      getHref: () => '/leaderboard/delta',
    },
    table: {
      path: '/leaderboard/data',
      getHref: () => '/leaderboard/data',
    },
  },
} as const;
