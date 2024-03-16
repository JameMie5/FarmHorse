// import React, { useState } from 'react';
// import ImageUploader from 'react-images-uploading';

// function MyImageUploader() {
//   const [images, setImages] = useState([]);
//   const maxNumber = 5;

//   const onChange = (imageList: React.SetStateAction<never[]>, addUpdateIndex: any) => {
//     console.log(imageList, addUpdateIndex);
//     setImages(imageList);
//   };

//   return (
//     <div>
//       <ImageUploader
//         withIcon={true}
//         buttonText="Choose images"
//         onChange={onChange}
//         imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
//         maxFileSize={5242880}
//         withPreview={true}
//         maxNumber={maxNumber}
//       />
//     </div>
//   );
// }

// export default MyImageUploader;
