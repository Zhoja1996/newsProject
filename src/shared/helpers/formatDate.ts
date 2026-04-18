export const formatDate = (date: Date, language: "en" | "uk" = "en") => {
    const locale = language === "uk" ? "uk-UA" : "en-US";
  
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };