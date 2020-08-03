exports.formatDates = (list) => {
  const newList = list.map((date) => {
    const dateCopy = { ...date };
    const formattedDate = new Date(date.created_at);
    dateCopy.created_at = formattedDate;
    return dateCopy;
  });
  return newList;
};

exports.makeRefObj = (lists) => {
  const articleRef = {};
  lists.forEach((list) => {
    const titleRef = list.title;
    const idRef = list.article_id;
    articleRef[titleRef] = idRef;
  });
  return articleRef;
};

exports.formatComments = (comments, articleRef) => {
  const formattedData = comments.map((comment) => {
    const newCommentsData = { ...comment };
    newCommentsData.article_id = articleRef[comment.belongs_to];
    delete newCommentsData.belongs_to;
    newCommentsData.author = comment.created_by;
    delete newCommentsData.created_by;
    newCommentsData.created_at = new Date(newCommentsData.created_at);
    return newCommentsData;
  });

  return formattedData;
};
