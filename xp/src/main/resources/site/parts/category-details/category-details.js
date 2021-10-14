const libs = {
  portal: require("/lib/xp/portal"),
  thymeleaf: require("/lib/thymeleaf"),
  content: require("/lib/xp/content"),
};

exports.get = (req) => {
  const getCategoryData = () => {
    const content = libs.portal.getContent();
    const isValidContent = content.type.split(":")[1] === "category";

    if (!isValidContent) {
      return {};
    }

    let categoryData = content.data;
    categoryData.image =
      {
        src:
          categoryData.image &&
          libs.portal.attachmentUrl({ id: categoryData.image }),
        maxWidth: "300px",
        maxHeight: "300px",
      } || {};

    return categoryData;
  };

  const category = getCategoryData();

  const model = { category, show: Object.keys(category).length > 0 };

  return {
    body: libs.thymeleaf.render(resolve("category-details.html"), model),
  };
};

const forceArray = (data) => (!Array.isArray(data) ? [data] : data);
