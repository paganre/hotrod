import { isCurrentQuestionLater } from "./storageHelpers";
import md5 from "blueimp-md5";

export const getApiPath = function (): string {
  const lastQuestion = localStorage.getItem("lastQuestion") || "playground/1";
  if (window.location.pathname === "/") {
    window.location.pathname = `/${lastQuestion}`;
  } else {
    const currentQuestion = window.location.pathname
      .split("/")
      .splice(1)
      .join("/");
    if (isCurrentQuestionLater(currentQuestion, lastQuestion)) {
      // update last question
      localStorage.setItem("lastQuestion", currentQuestion);
    }
  }
  return `/api${window.location.pathname}`;
};

export const getApiInputPath = function (): string {
  return `/api${window.location.pathname}/input`;
};

export const canvasHash = function (canvas: number[][]): string {
  return md5(canvas.join(","));
};
