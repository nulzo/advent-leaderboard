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
      delta: {
        path: 'delta',
        getHref: () => 'leaderboard/delta',
      },
      heatmap: {
        path: 'heatmap',
        getHref: () => 'leaderboard/heatmap',
      },
      points: {
        path: 'points',
        getHref: () => 'leaderboard/points',
      },
      stars: {
        path: 'stars',
        getHref: () => 'leaderboard/stars',
      },
      table: {
        path: 'table',
        getHref: () => 'leaderboard/table',
      },
    },
  } as const;