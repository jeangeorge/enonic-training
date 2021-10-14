var libs = {
  portal: require("/lib/xp/portal"),
  thymeleaf: require("/lib/thymeleaf"),
  content: require("/lib/xp/content"),
  menu: require("/lib/menu"),
};

// Handle GET request
exports.get = function (req) {
  const site = libs.portal.getSite(); // Current site
  const content = libs.portal.getContent(); // Current content

  const basePath = "/bootstrap-starter";

  const pagesUrls = {
    posts: libs.portal.pageUrl({ path: basePath + "/posts" }),
    authors: libs.portal.pageUrl({ path: basePath + "/authors" }),
    categories: libs.portal.pageUrl({ path: basePath + "/categories" }),
  };

  const getPageTitle = () =>
    content["displayName"] + " - " + site["displayName"];

  const getMetaDescription = () =>
    getExtraData(content, "html-meta").htmlMetaDescription || "";

  const getExtraData = (content, property) => {
    const appNamePropertyName = app.name.replace(/\./g, "-");
    const extraData =
      ((content.x || {})[appNamePropertyName] || {})[property] || {};
    return extraData;
  };

  const model = {
    mainRegion: content.page.regions["main"],
    pageTitle: getPageTitle(),
    pagePath: content._path.split("starter/")[1].split("/")[0],
    metaDescription: getMetaDescription(),
    pagesUrls,
  };

  return {
    body: libs.thymeleaf.render(resolve("default.html"), model),
  };
};
