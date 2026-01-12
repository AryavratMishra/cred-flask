from server import app
from tests.modules.task.base_test_task import BaseTestTask
from modules.comment.rest_api.comment_rest_api_server import CommentRestApiServer
from modules.comment.internal.store.comment_repository import CommentRepository
from modules.comment.types import CommentErrorCode
from modules.authentication.types import AccessTokenErrorCode
import json

class TestCommentApi(BaseTestTask):
    DEFAULT_COMMENT_CONTENT = "This is a test comment."

    def setUp(self) -> None:
        super().setUp()
        CommentRestApiServer.create()
        CommentRepository.collection().delete_many({})

    def tearDown(self) -> None:
        super().tearDown()
        CommentRepository.collection().delete_many({})

    # HELPER METHODS

    def get_comment_api_url(self, account_id: str, task_id: str) -> str:
        return f"http://127.0.0.1:8080/api/accounts/{account_id}/tasks/{task_id}/comments"

    def get_comment_by_id_api_url(self, account_id: str, comment_id: str) -> str:
        return f"http://127.0.0.1:8080/api/accounts/{account_id}/comments/{comment_id}"

    def make_comment_request(self, method: str, account_id: str, token: str, url: str, data: dict = None):
        headers = {**self.HEADERS, "Authorization": f"Bearer {token}"}
        with app.test_client() as client:
            if method.upper() == "POST":
                return client.post(url, headers=headers, data=json.dumps(data) if data else None)
            elif method.upper() == "GET":
                return client.get(url, headers=headers)
            elif method.upper() == "PATCH":
                return client.patch(url, headers=headers, data=json.dumps(data) if data else None)
            elif method.upper() == "DELETE":
                return client.delete(url, headers=headers)

    # TESTS

    def test_create_comment_success(self) -> None:
        account, token = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        
        data = {"content": self.DEFAULT_COMMENT_CONTENT}
        url = self.get_comment_api_url(account.id, task.id)
        
        response = self.make_comment_request("POST", account.id, token, url, data)
        
        assert response.status_code == 201
        assert response.json["content"] == self.DEFAULT_COMMENT_CONTENT
        assert response.json["task_id"] == task.id
        assert response.json["account_id"] == account.id
        assert response.json.get("id") is not None

    def test_create_comment_missing_content(self) -> None:
        account, token = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        
        data = {}
        url = self.get_comment_api_url(account.id, task.id)
        
        response = self.make_comment_request("POST", account.id, token, url, data)
        
        self.assert_error_response(response, 400, CommentErrorCode.BAD_REQUEST)
        assert "Content is required" in response.json["message"]

    def test_get_comments_success(self) -> None:
        account, token = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        
        # Create 2 comments
        url = self.get_comment_api_url(account.id, task.id)
        self.make_comment_request("POST", account.id, token, url, {"content": "Comment 1"})
        self.make_comment_request("POST", account.id, token, url, {"content": "Comment 2"})
        
        response = self.make_comment_request("GET", account.id, token, url)
        
        assert response.status_code == 200
        assert len(response.json) == 2
        # Verify order (latest first) or checking contents
        contents = [c["content"] for c in response.json]
        assert "Comment 1" in contents
        assert "Comment 2" in contents

    def test_update_comment_success(self) -> None:
        account, token = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        
        # Create comment
        url = self.get_comment_api_url(account.id, task.id)
        create_response = self.make_comment_request("POST", account.id, token, url, {"content": "Original Content"})
        comment_id = create_response.json["id"]
        
        # Update comment
        update_url = self.get_comment_by_id_api_url(account.id, comment_id)
        update_data = {"content": "Updated Content"}
        update_response = self.make_comment_request("PATCH", account.id, token, update_url, update_data)
        
        assert update_response.status_code == 200
        assert update_response.json["content"] == "Updated Content"
        assert update_response.json["id"] == comment_id

    def test_delete_comment_success(self) -> None:
        account, token = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        
        # Create comment
        url = self.get_comment_api_url(account.id, task.id)
        create_response = self.make_comment_request("POST", account.id, token, url, {"content": "To Delete"})
        comment_id = create_response.json["id"]
        
        # Delete comment
        delete_url = self.get_comment_by_id_api_url(account.id, comment_id)
        delete_response = self.make_comment_request("DELETE", account.id, token, delete_url)
        
        assert delete_response.status_code == 204
        
        # Verify bad request on update (not found handled differently) OR verify list is empty
        # Try update - expects Not Found
        update_response = self.make_comment_request("PATCH", account.id, token, delete_url, {"content": "New"})
        self.assert_error_response(update_response, 404, CommentErrorCode.NOT_FOUND)

