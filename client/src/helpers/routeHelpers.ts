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
  const lastRoute = (localStorage.getItem("lastRoute") || "level") as RouteType;
  if (lastRoute === "level") {
    const lastQuestion = localStorage.getItem("lastQuestion") || "playground/1";
    window.location.pathname = `/${lastQuestion}`;
  } else if (lastRoute === "world") {
    window.location.pathname = `/world`;
  }
  return true;
};
