[Skip to content](#VPContent)

## Open API

213 字 小于 1 分钟

服务请求地址为 `https://api.cnb.cool` 。

API 文档地址 [https://api.cnb.cool （在新窗口打开）](https://api.cnb.cool) 。

- `Authorization` 进行检验，格式为: `Bearer ${token}` ，其中 `${token}` 为 [访问令牌](/zh/guide/access-token.html)
- `Accept` 根据 API 文档中 **Response content type** 列举的可选类型，填写对应的值，如： `application/json`

curl 请求示例

```shell
curl  -X "GET" \
      -H "accept: application/json" \
      -H "Authorization: Bearer 1Z00000000000000000000000vA" \
  "https://api.cnb.cool/user/groups?page=1&page_size=10"
```

返回示例

```json
[
  {
    "id": 1816756487609032700,
    "name": "test",
    "remark": "测试组织",
    "description": "",
    "site": "",
    "email": "",
    "freeze": false,
    "wechat_mp": "hello-world",
    "created_at": "2024-07-26T08:44:35Z",
    "updated_at": "2024-08-13T07:32:13Z",
    "follow_count": 0,
    "member_count": 4,
    "all_member_count": 4,
    "sub_group_count": 5,
    "sub_repo_count": 7,
    "sub_mission_count": 1,
    "all_sub_group_count": 13,
    "all_sub_repo_count": 12,
    "all_sub_mission_count": 1,
    "has_sub_group": true,
    "path": "test",
    "access_role": "Owner"
  }
]
```

仓库动态接口详见 [仓库动态](/zh/develops/openapi-event.html)