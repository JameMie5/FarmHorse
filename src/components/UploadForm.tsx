import React from 'react';

interface UploadFormProps {
  onFileChange: (file: File) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onFileChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="upload-input"
        className="file-input"
        accept="image/*"
        onChange={handleFileChange}
      />
      <label htmlFor="upload-input" className="upload-label">
        <img className="rounded-circle _img_profile_" src="/img/profile-demo.png" alt="user-demo" />
      </label>
    </div>
  );
};

export default UploadForm;
