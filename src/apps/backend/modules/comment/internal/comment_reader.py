from modules.comment.internal.store.comment_repository import CommentRepository
from modules.comment.internal.comment_util import CommentUtil
from modules.comment.types import GetCommentsParams, Comment


class CommentReader:
    @staticmethod
    def get_comments_by_task(*, params: GetCommentsParams) -> list[Comment]:
        filter_query = {"task_id": params.task_id, "account_id": params.account_id}
        cursor = CommentRepository.collection().find(filter_query).sort("created_at", -1)

        comments_bson = list(cursor)
        return [CommentUtil.convert_comment_bson_to_comment(comment_bson) for comment_bson in comments_bson]
