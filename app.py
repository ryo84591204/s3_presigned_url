import json
import logging


import boto3

# import uvicorn
from boto3.exceptions import ClientError
from fastapi import FastAPI
from mangum import Mangum

# TODO: Add this line
from starlette.middleware.cors import CORSMiddleware

logger = logging.getLogger()
logger.setLevel("INFO")

app = FastAPI(title="FastAPI Mangum Example", version="1.0.0")

# TODO: Add these lines
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["x-apigateway-header", "Content-Type", "X-Amz-Date"],
)

handler = Mangum(app)

s3 = boto3.client(
    "s3",
    endpoint_url="http://localstack:4566",
    aws_access_key_id="dummy",
    aws_secret_access_key="dummy",
    region_name="ap-northeast-1",
)

bucket_name = "my-bucket"


def generate_presigned_url(object_key: str) -> str:
    """
    署名付きURLの取得
    :param object_key: オブジェクトキー
    :return: 署名付きURL
    """
    try:
        response = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": object_key},
            ExpiresIn=3600,
        )
        return response
    except ClientError as e:
        logger.error(e)
        raise e


@app.get("/")
def root():
    logger.info("root")

    response = generate_presigned_url("")
    logger.info(response)

    # response = s3.get_object(Bucket=bucket_name, Key="test.json")
    # body = response["Body"].read()

    return {
        "statusCode": 200,
        "body": json.dumps(response["Messages"][0]),
    }


lambda_handler = Mangum(app)

print(lambda_handler)
# if __name__ == "__main__":
#     uvicorn.run(app)
