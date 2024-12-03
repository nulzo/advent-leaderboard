import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";

export const NotFoundRoute = () => {
  return (
    <div className="mt-52 flex flex-col items-center font-semibold">
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Button variant="link">
        <a href={paths.home.getHref()}>Go to Home</a>
      </Button>
    </div>
  );
};
