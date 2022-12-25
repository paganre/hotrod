export const isCurrentQuestionLater = function (
  currentQuestion: string,
  lastQuestion: string
): boolean {
  if (lastQuestion === "playground") {
    return true;
  }
  const currentlyInPlayground = currentQuestion.startsWith("playground/");
  const lastlyInPlayground = lastQuestion.startsWith("playground/");
  if (currentlyInPlayground && lastlyInPlayground) {
    return (
      parseInt(currentQuestion.split("/")[1]) >
      parseInt(lastQuestion.split("/")[1])
    );
  } else if (currentlyInPlayground && !lastlyInPlayground) {
    return false;
  } else if (!currentlyInPlayground && lastlyInPlayground) {
    return true;
  } else {
    try {
      return parseInt(currentQuestion) > parseInt(lastQuestion);
    } catch (error) {
      return true;
    }
  }
};
