import { OpenPanelComponent } from "@openpanel/nextjs";

enum ANALYTIC_EVENT {
  NAV_GITHUB = "nav-github",
  HOME_GITHUB = "home-github",
  COMPONENT_COPY = "component-copy",
  COMPONENT_DOWNLOAD = "component-download",
}

const Analytics = () => {
  if (process.env.ENVIRONMENT !== "production") return null;

  return (
    <OpenPanelComponent
      clientId={process.env.CLIENT_ID!}
      clientSecret={process.env.SECRET!}
      trackScreenViews={true}
      trackAttributes={true}
    />
  );
};

export { Analytics, ANALYTIC_EVENT };
