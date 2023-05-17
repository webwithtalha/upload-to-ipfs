const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const createClient = require("./create-client.js");

const readdirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);

async function run() {
  const client = await createClient();

  // Read image files from the 'images' directory
  const imagesDir = path.join(__dirname, "../data/images-demo"); // for real images use images directory
  const imageFiles = await readdirAsync(imagesDir);
  const imagePaths = imageFiles.map((file) => path.join(imagesDir, file));

  const imageBuffers = await Promise.all(
    imagePaths.map((file) => readFileAsync(file))
  );

  let counter = 0;

  // Convert images to base64 strings
  const files = imageBuffers.map((buffer) => {
    counter++;
    return {
      path: "/" + counter,
      content: buffer,
    };
  });

  // Upload images
  let uploadedImagesData = null;

  for await (const result of client.addAll(files, {
    wrapWithDirectory: true,
  })) {
    uploadedImagesData = result;
    console.log(result);
  }

  fs.writeFileSync(
    path.join(__dirname, "../data/uploaded-images-dir.json"),
    JSON.stringify({
      images_dir_cid: uploadedImagesData.cid.toString(),
      images_dir_size: uploadedImagesData.size,
    })
  );
}

run().catch(console.log);
