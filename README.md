# s3_presigned_url

## localstackを起動
```bin/bash
docker compose up -d
```

## sam
```
# ビルド
sam build

# sam deploy localstackプロファイルを使用
sam deploy --profile localstack
```