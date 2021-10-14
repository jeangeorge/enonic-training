const libs = {
  portal: require("/lib/xp/portal"),
  thymeleaf: require("/lib/thymeleaf"),
  content: require("/lib/xp/content"),
};

const formatCategoriesArray = (categories) =>
  categories.map((categoryId) => libs.content.get({ key: categoryId }).data);

exports.get = (req) => {
  const getPostData = () => {
    const content = libs.portal.getContent();
    const isValidContent = content.type.split(":")[1] === "post";

    if (!isValidContent) {
      return {};
    }

    let postData = content.data;
    postData.categories = formatCategoriesArray(
      forceArray(postData.categories)
    );
    postData.author = libs.content.get({ key: postData.author });
    postData.image =
      {
        src:
          postData.image && libs.portal.attachmentUrl({ id: postData.image }),
        maxWidth: "300px",
        maxHeight: "300px",
      } || {};
    postData.html = libs.portal.processHtml({ value: postData.html });
    return postData;
  };

  const post = getPostData();

  const model = { post, show: Object.keys(post).length > 0 };

  return {
    body: libs.thymeleaf.render(resolve("post-details.html"), model),
  };
};

const forceArray = (data) => (!Array.isArray(data) ? [data] : data);
