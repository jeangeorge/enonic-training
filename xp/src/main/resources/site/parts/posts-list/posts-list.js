const portal = require("/lib/xp/portal");
const thymeleaf = require("/lib/thymeleaf");
const content = require("/lib/xp/content");

// Handle the GET request
exports.get = function (req) {
  const component = portal.getComponent() || {};
  const config = component.config || {};

  // Get the country content as a JSON object
  const getPostsData = () => {
    let postsData = [];
    const postsFolder = config["posts-folder"] || false;
    if (postsFolder) {
      postsData = content
        .getChildren({
          key: postsFolder,
          start: 0,
          count: -1,
        })
        .hits.map((post) => {
          post.author = content.get({ key: post.data.author }).data;
          post.href = portal.pageUrl({ id: post._id });
          return post;
        });
    }
    return postsData;
  };

  const getPagesData = () => {
    const pageUpdate = config["post-update-page"] || "";
    const pageDelete = config["post-delete-page"] || "";

    return {
      pageUpdate: portal.pageUrl({ id: pageUpdate }),
      pageDelete: portal.pageUrl({ id: pageDelete }),
    };
  };

  // Specify the view file to use
  const view = resolve("posts-list.html");

  const model = {
    posts: getPostsData(),
    config: getPagesData(),
    createPost: portal.pageUrl({
      path: "/bootstrap-starter/form/create-post",
    }),
    deleteFunction: portal.serviceUrl({
      service: "crud-post",
      params: {
        action: "delete",
      },
    }),
  };

  // Return the merged view and model in the response object
  return {
    body: thymeleaf.render(view, model),
  };
};
