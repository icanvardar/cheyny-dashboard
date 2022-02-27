import { create } from "ipfs-http-client";
import { useEffect, useState } from "react";

import { Buffer } from "buffer";

const client = create("https://ipfs.infura.io:5001/api/v0");

const useUploadIpfs = () => {
  const handleUploadIpfs = async (metadata) => {
    return new Promise((resolve, reject) => {
      let tmp = metadata;
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(tmp.image);
      reader.onloadend = async () => {
        const createdImage = await client.add(Buffer(reader.result));
        tmp.image = createdImage.path;
        tmp.info.amount = parseInt(tmp.info.amount);
        tmp.info.year = parseInt(tmp.info.year);
        const createdMetadata = await client.add(Buffer(JSON.stringify(tmp)));
        resolve(createdMetadata);
      };
    });
  };

  return [handleUploadIpfs];
};

export default useUploadIpfs;
