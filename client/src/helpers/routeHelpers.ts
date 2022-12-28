export type RouteType = "world" | "level";

export const getRouteType = function (): RouteType {
  if (window.location.pathname === "/world") {
    return "world";
  } else {
    return "level";
  }
};

export const reroute = function (): boolean {
  if (window.location.pathname !== "/") {
    return false;
  }
  window.location.pathname = `/world`;
  return true;
};
