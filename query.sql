\c nc_news_test

select articles.*
from articles
left join comments
on articles.article_id = comments.article_id
group by articles.article_id;
