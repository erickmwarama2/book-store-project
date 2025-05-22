exports.getNotFound = (req, res, next) => {
  // res.status(404).send("<h1>Page not found </h1>");
  // res.status(404).sendFile(path.join(rootDir, "views", "not-found.html"));
  res.status(404).render("not-found", { pageTitle: "Page not Found" });
};
