#!/bin/bash

echo "S3バケットの作成"
awslocal s3 mb s3://my-bucket
echo "S3バケットの作成完了"
