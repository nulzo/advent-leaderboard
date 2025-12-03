import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { paths } from "@/config/paths";
import { AppRoot, AppRootErrorBoundary } from "@/app/routes/root";

export const createAppRouter = (_queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: async () => {
        const { LandingRoute } = await import("./routes/landing/landing");
        return { Component: LandingRoute };
      },
    },
    {
      path: paths.app.root.path,
      element: <AppRoot />,
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: paths.app.root.path,
          lazy: async () => {
            const { LeaderboardRoute } = await import(
              "./routes/leaderboard/leaderboard-page.tsx"
            );
            return { Component: LeaderboardRoute };
          },
        },
        {
          path: paths.app.points.path,
          lazy: async () => {
            const { PointsRoute } = await import(
              "./routes/points/points-page.tsx"
            );
            return { Component: PointsRoute };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.heatmap.path,
          lazy: async () => {
            const { LeaderboardHeatmapRoute } = await import(
              "./routes/heatmap/heatmap-page.tsx"
            );
            return { Component: LeaderboardHeatmapRoute };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.delta.path,
          lazy: async () => {
            const { DeltaRoute } = await import(
              "./routes/delta/delta-page.tsx"
            );
            return { Component: DeltaRoute };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.table.path,
          lazy: async () => {
            const { TableRoute } = await import(
              "./routes/table/table-page.tsx"
            );
            return { Component: TableRoute };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
      ],
    },
    {
      path: "*",
      lazy: async () => {
        const { NotFoundRoute } = await import("./routes/not-found");
        return {
          Component: NotFoundRoute,
        };
      },
      ErrorBoundary: AppRootErrorBoundary,
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
