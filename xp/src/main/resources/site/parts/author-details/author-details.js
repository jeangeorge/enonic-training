const libs = {
  portal: require("/lib/xp/portal"),
  thymeleaf: require("/lib/thymeleaf"),
  content: require("/lib/xp/content"),
};

exports.get = (req) => {
  const getAuthorData = () => {
    const content = libs.portal.getContent();
    const isValidContent = content.type.split(":")[1] === "author";

    if (!isValidContent) {
      return {};
    }

    let authorData = content.data;
    authorData.roles = forceArray(authorData.roles);
    authorData.image =
      {
        src:
          authorData.image &&
          libs.portal.attachmentUrl({ id: authorData.image }),
        maxWidth: "300px",
        maxHeight: "300px",
      } || {};

    return authorData;
  };

  const author = getAuthorData();

  const model = { author, show: Object.keys(author).length > 0 };

  return {
    body: libs.thymeleaf.render(resolve("author-details.html"), model),
  };
};

const forceArray = (data) => (!Array.isArray(data) ? [data] : data);
