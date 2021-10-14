var content = require("/lib/xp/content");

const createPost = (data) => {
  log.info(data);
  content.create({
    _name: data.title.split(" ").join("-").toLowerCase(),
    parentPath: `${data["posts-folder-path"]}`,
    displayName: data.title,
    contentType: `${app.name}:post`,
    data: {
      title: data.title,
      shortTitle: data.shortTitle,
      html: data.html,
      categories: data.categories,
      author: data.author,
    },
  });
};

const deletePost = (data) => {
  const result = content.delete({
    key: data.id,
  });

  if (result) {
    log.info("Post with id " + data.id + " deleted.");
  } else {
    log.info("Delete error");
  }
};

exports.get = (req) => {
  const postId = (req.params && req.params.id) || "";

  const post = content.get({ key: postId }) || {};

  return {
    body: {
      status: Object.keys(post).length > 0 ? "200" : "404",
      post,
    },
    contentType: "application/json",
  };
};

exports.post = (req) => {
  const data = req.params;
  const action = data.action;
  log.info(JSON.stringify(req, null, 4));

  switch (action) {
    case "create":
      createPost(data);
      break;
    case "delete":
      deletePost(data);
      break;
  }
};
