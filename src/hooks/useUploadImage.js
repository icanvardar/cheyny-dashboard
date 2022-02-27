import { useState } from "react";

const useUploadImage = () => {
  const [image, setImage] = useState();
  const [imageURL, setImageURL] = useState();

  const onImageChange = (e) => {
    const imageInstance = e.target.files[0];
    setImage(imageInstance);
    setImageURL(URL.createObjectURL(imageInstance));
  };

  return [image, imageURL, onImageChange];
};

export default useUploadImage;
