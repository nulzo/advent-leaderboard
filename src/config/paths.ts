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
        path: '/leaderboard/delta',
        getHref: () => 'leaderboard/delta',
      },
      heatmap: {
        path: '/leaderboard/heatmap',
        getHref: () => 'leaderboard/heatmap',
      },
      points: {
        path: '/leaderboard/points',
        getHref: () => 'leaderboard/points',
      },
      stars: {
        path: '/leaderboard/stars',
        getHref: () => 'leaderboard/stars',
      },
      table: {
        path: '/leaderboard/table',
        getHref: () => 'leaderboard/table',
      },
    },
  } as const;