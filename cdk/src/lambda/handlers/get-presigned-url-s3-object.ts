import { generatePresignedURL } from '../infrastructures/s3-generate-presigned-url';
import { z } from 'zod';

interface Event {
  pathParameters: {
    object_key: string;
  };
}

interface Response {
  statusCode: number;
  body?: string;
}

const Scheme = z.object({
  object_key: z.string().min(1),
});

export const handler = async (event: Event): Promise<Response> => {
  try {
    console.log('Event', JSON.stringify(event, undefined, 2));
    const pathParameters = Scheme.strict().safeParse(event.pathParameters);
    if (!pathParameters.success) {
      console.log('Validation error', pathParameters.error);
      return { statusCode: 400 };
    }
    const response = await generatePresignedURL(pathParameters.data.object_key);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log('Error', JSON.stringify(error, undefined, 2));
    return { statusCode: 500 };
  }
};
