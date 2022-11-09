import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

export type Props = {
  setImageUrl: (imageUrl: string) => void;
};
function UploadImage({ setImageUrl }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [imageLink, setImageLink] = useState('');

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (!newFile) return;
    // setFile(newFile);
    /* Creating a URL for the file. */
    setPreview(URL.createObjectURL(newFile));
    /* Creating a form data object and appending the file and the upload preset to it. */
    const formData = new FormData();
    formData.append('file', newFile);
    formData.append('upload_preset', 'qvent-managment');
    /* Sending the image to cloudinary and getting the url back. */
    const data = await fetch(
      'https://api.cloudinary.com/v1_1/dawnyquoz/image/upload',
      {
        method: 'POST',
        body: formData,
      },
    ).then((res) => res.json());
    setImageUrl = data.secure_url;
    setImageLink(data.secure_url);
  };

  function postImageHandler() {}

  return (
    <div>
      <label htmlFor="file">Upload an image</label>
      <input
        id="file"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {!!preview && (
        <Image width={100} height={100} src={String(preview)} alt="preview" />
      )}
      <button onClick={() => postImageHandler()}>Upload</button>
    </div>
  );
}
export default UploadImage;
