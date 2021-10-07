const libs = {
  portal: require("/lib/xp/portal"),
  thymeleaf: require("/lib/thymeleaf"),
  content: require("/lib/xp/content"),
};

exports.get = (request) => {
  const getAuthorData = () => {
    const content = libs.portal.getContent();

    const isValidContent = content.type.split(":")[1] === "author";

    if (!isValidContent) {
      return {};
    }

    const { data } = content;
    const { roles, image } = data;

    return {
      roles: forceArray(roles),
      image:
        {
          src: image && libs.portal.attachmentUrl({ id: image }),
          maxWidth: "300px",
          maxHeight: "300px",
        } || {},
    };
  };

  const author = getAuthorData();

  const model = { author, show: Object.keys(author).length > 0 };

  return {
    body: libs.thymeleaf.render(resolve("author-details.html"), model),
  };
};

const forceArray = function (data) {
  if (!Array.isArray(data)) {
    data = [data];
  }
  return data;
};
