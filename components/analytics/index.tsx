import { OpenPanelComponent } from "@openpanel/nextjs";

enum ANALYTIC_EVENT {
  NAV_GITHUB = "nav-github",
  HOME_GITHUB = "home-github",
  COMPONENT_COPY = "component-copy",
  COMPONENT_DOWNLOAD = "component-download",
}

const Analytics = () => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT !== "production") return null;

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SECRET;

  if (!clientId || !clientSecret) {
    console.warn("Client ID or Secret is missing.");
    return null;
  }

  return (
    <OpenPanelComponent
      clientId={clientId}
      clientSecret={clientSecret}
      trackScreenViews={true}
      trackAttributes={true}
    />
  );
};

export { Analytics, ANALYTIC_EVENT };
