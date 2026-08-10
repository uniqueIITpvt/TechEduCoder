import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: 'eBook', // Specify your desired folder
      // format: ['pdf', 'jpg'], // Force convert to pdf format
      public_id: file.fieldname + '-' + Date.now(),
    };
  },
});

export default storage