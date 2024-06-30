#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { PresignedUrlGenerateApiStack } from "../lib/presigned-url-generate-api-stack.ts";
import { PresignedUrlGenerateBucketStack } from "../lib/presigned-url-generate-bucket-stack";

const app = new cdk.App();

const bucket = new PresignedUrlGenerateBucketStack(
  app,
  "PresignedUrlGenerateBucketStack"
);
new PresignedUrlGenerateApiStack(app, "PresignedUrlGenerateApiStack", {
  dataBucket: bucket.dataBucket,
});
