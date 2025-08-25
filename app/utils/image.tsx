import {launchImageLibraryAsync} from 'expo-image-picker'

export const usePickIamge = () => {
  const pickImage = async () => {
    const result = await launchImageLibraryAsync({mediaTypes: 'images'})
    if (result.assets && result.assets.length > 0) {
      const localFileUri = result.assets[0].uri
      return localFileUri
      //   storage.save('profilelocalFileUri', localFileUri)
      //   console.log('Image path saved:', localFileUri)
    }
  }

  return {pickImage}
}
