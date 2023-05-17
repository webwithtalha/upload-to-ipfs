const fs = require("fs");
const path = require("path");
const createClient = require("./create-client");
const metadata = require("../data/metadata-demo.json"); // for real data use metadata.json
const uploadedImagesDir = require("../data/uploaded-images-dir.json");

async function run() {
  const client = await createClient();

  const files = [];

  for (const key in metadata) {
    const data = metadata[key];
    data.image = `ipfs://${uploadedImagesDir.images_dir_cid}/${key}`;

    files.push({
      path: `/${key}.json`,
      content: Buffer.from(JSON.stringify(data)),
    });
  }

  let uploadedMetaData = null;

  for await (const result of client.addAll(files, {
    wrapWithDirectory: true,
  })) {
    uploadedMetaData = result;
    console.log(result);
  }

  fs.writeFileSync(
    path.join(__dirname, "../data/uploaded-metadata-dir.json"),
    JSON.stringify({
      metadata_dir_cid: uploadedMetaData.cid.toString(),
      metadata_dir_size: uploadedMetaData.size,
    })
  );
}

run().catch(console.log);
