import { listAll, ref, uploadBytes } from 'firebase/storage';
import { createContext } from 'react';
import { storage } from '../config/firebase';

export const ImagesContext = createContext()

const ImagesProvider = (props: any) => {
  const imagesRef = ref(storage, "images");

  const imageContext = {
    uploadImage: async({image}) => {
      uploadBytes(imagesRef, image).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });
    },
    getImage: async({image}) => {
      
    },
    list: async() => {
      listAll(imagesRef).then((res) => {
        res.items.forEach((itemRef) => {
          console.log(itemRef)
        })
      })
    }
  }
  
  return <ImagesContext.Provider value={imageContext} {...props} />;
}

export default ImagesProvider