import { useRef, useState } from "react";
import Modal from "./Modal";

const Profile = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [longText,setLongText] = useState("");
  const [lang,setLang]=useState("eng")

  const updateAvatar = async (imgSrc) => {
    setCroppedImage(imgSrc);

    // Convert the base64 image data to a Blob
    const response = await fetch(imgSrc);
    const blob = await response.blob();

    // Create a FormData object and append the Blob
    const formData = new FormData();
    formData.append('file', blob, 'image.jpg');
    formData.append('lang',lang);

    // Send the image to the OCR server
    const ocrResponse = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    });
    const text = await ocrResponse.text();
    setLongText(text)

  };

  return (
    <div className="flex flex-col items-center pt-12">
      <div className="relative">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" // Added mr-4 here
          title="Change photo"
          onClick={() => setModalOpen(true)}
        >
          Upload Image
        </button>
        <select 
          className="bg-black text-white border-none" 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
        >
          <option value={"eng"}>English</option>
          <option value={"hin"}>Hindi</option>
          <option value={"Devanagari"}>Sanskrit</option>
        </select>
      </div>
      {modalOpen && (
        <Modal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
        />
      )}
      <div className="flex flex-col items-center mt-8">
        {croppedImage && (
          <img src={croppedImage} alt="Cropped Image"  />
        )}
        <div className="mt-4 w-1/2 mx-auto">
          <p>{longText}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
