export const getSurveyEmojiPercentage = (emoji: number) => {
  switch (emoji) {
    case 1:
      return 100;
    case 2:
      return 75;
    case 3:
      return 50;
    case 4:
      return 25;
    default:
      return 0;
  }
};
