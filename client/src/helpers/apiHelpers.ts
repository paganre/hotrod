import { isCurrentQuestionLater } from "./storageHelpers";
import md5 from "blueimp-md5";
import { getRouteType, reroute } from "./routeHelpers";

export const getApiPath = function (): string {
  if (getRouteType() === "world") {
    return "";
  }
  const lastQuestion = localStorage.getItem("lastQuestion") || "playground/1";
  const currentQuestion = window.location.pathname
    .split("/")
    .splice(1)
    .join("/");
  if (isCurrentQuestionLater(currentQuestion, lastQuestion)) {
    // update last question
    localStorage.setItem("lastQuestion", currentQuestion);
  }
  return `/api${window.location.pathname}`;
};

export const getApiInputPath = function (): string {
  return `/api${window.location.pathname}/input`;
};

export const canvasHash = function (canvas: number[][]): string {
  return md5(canvas.join(","));
};

export const getApiDonePath = function (): string {
  return `/api${window.location.pathname}/done`;
};
