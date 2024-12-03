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
      users: {
        path: 'users',
        getHref: () => '/app/users',
      },
      profile: {
        path: 'profile',
        getHref: () => '/app/profile',
      },
    },
  } as const;