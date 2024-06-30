import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { TaskTableError } from './errors/task-table-error';

const region = process.env.AWS_REGION as string;
const bucketName = process.env.BUCKET_NAME as string;
const s3Client = new S3Client({ region: region });

/**
 * 署名付きURLの取得
 * @param object_key
 */
export const generatePresignedURL = async (
  object_key: string,
): Promise<string> => {
  try {
    const bucketParams = {
      Bucket: bucketName,
      Key: `${object_key}`,
      Body: 'BODY',
    };

    const command = new GetObjectCommand(bucketParams);
    const response = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return response;
  } catch (e) {
    throw new TaskTableError(`Error of ${bucketName}`, e as Error);
  }
};