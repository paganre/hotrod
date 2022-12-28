export const isCurrentQuestionLater = function (
  currentQuestion: string,
  lastQuestion: string
): boolean {
  if (lastQuestion === "playground") {
    return true;
  }
  const currentPath = currentQuestion.split("/");
  const lastPath = currentQuestion.split("/");
  if (lastPath.length === 1) {
    return true;
  }
  const namespaces = ["playground", "1", "2", "S"];
  const currentNamespaceIndex = namespaces.indexOf(currentPath[0]);
  const lastNamespaceIndex = namespaces.indexOf(lastPath[0]);
  if (currentNamespaceIndex > lastNamespaceIndex) {
    return true;
  } else if (currentNamespaceIndex < lastNamespaceIndex) {
    return false;
  } else {
    try {
      return parseInt(currentQuestion) > parseInt(lastQuestion);
    } catch (error) {
      return true;
    }
  }
};
