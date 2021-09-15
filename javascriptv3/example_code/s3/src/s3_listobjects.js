
import pkg from '@aws-sdk/client-s3';
const { ListObjectsV2Command, GetObjectCommand } = pkg;
import { s3Client } from "./libs/s3Client.js"; // Helper function that creates Amazon S3 service client module.

// Create the parameters for the bucket
export const bucketParams = { Bucket: "rvcf-findmd-sandbox-static-site" };

async function prepareSitemapList() {
  try {
    const data = await s3Client.send(new ListObjectsV2Command({ Bucket: "rvcf-findmd-sandbox-static-site" }));
    return data.Contents
  } catch (err) {
    console.log("Error", err);
  }
};

async function getSitemapProviders(key) {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket:
          process.env.PROVIDERS_SITEMAP_BUCKET ||
          'rvcf-findmd-sandbox-static-site',
        Key: key,
      })
    );

    // Create a helper function to convert a ReadableStream to a string.
    // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html#s3-example-creating-buckets-get-object
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      });
      const bodyContents = await streamToString(response.Body);
      console.log(bodyContents)
    return bodyContents;
  } catch (err) {
    // Catch any errors thrown from the request and handle it
   console.log(err)
  }
}

  const resolvedListArray = await prepareSitemapList();
  console.log(resolvedListArray)

  resolvedListArray.map(({Key}) => {
    getSitemapProviders(Key)
  });

