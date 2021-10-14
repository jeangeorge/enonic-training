const portal = require("/lib/xp/portal");
const thymeleaf = require("/lib/thymeleaf");
const content = require("/lib/xp/content");

// Handle the GET request
const getCategories = () =>
  content
    .query({
      start: 0,
      count: -1,
      contentTypes: [`${app.name}:category`],
    })
    .hits.map((category) => ({ id: category._id, title: category.data.title }))
    .sort((a, b) => a.title.localeCompare(b.title));

const getAuthors = () =>
  content
    .query({
      start: 0,
      count: -1,
      contentTypes: [`${app.name}:author`],
    })
    .hits.map((author) => ({
      id: author._id,
      name: author.data.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

exports.get = function (req) {
  const categories = getCategories();
  const authors = getAuthors();

  const view = resolve("create-post.html");

  const model = {
    data: {
      authors,
      categories,
    },
    config: {
      postsFolderPath: "/bootstrap-starter/posts",
    },
    serviceUrl: portal.serviceUrl({
      service: "crud-post",
      params: {
        action: "create",
      },
    }),
  };

  // Return the merged view and model in the response object
  return {
    body: thymeleaf.render(view, model),
  };
};
