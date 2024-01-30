import React from 'react';

// https://stackoverflow.com/questions/76396203/cart-and-context-api
// https://deku.posstree.com/react/context-api/#consumer


export const ImageContext = React.createContext({
                              imageData: undefined as ImageData | undefined,
                              loadImageData: (image: ImageData) => {},
});

export const ImageProvider = ({children}: any): JSX.Element => {
  const [imageData, setImageData] = React.useState<ImageData>();

  const loadImageData = (image: ImageData) => {
    setImageData(image);
  }

  return (
    <ImageContext.Provider value={{ 
                              imageData, 
                              loadImageData, 
                            }}
    >
      {children}
    </ImageContext.Provider>
  );
}