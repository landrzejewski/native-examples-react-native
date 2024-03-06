import { Image, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { launchCamera } from "react-native-image-picker";

const Avatar = () => {
  const [imageUrl, setImageUrl] = useState();

  const selectPhoto = async () => {
    try {
      /*const result = await launchImageLibrary({
        selectionLimit: 1,
        mediaType: 'photo',
      });*/
      const result = await launchCamera({});
      if (!result.didCancel) {
        const uri = result.assets[0].uri;
        setImageUrl(uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Pressable onPress={selectPhoto}>
      {!imageUrl && (
        <Image style={styles.image} source={require('./assets/profile.png')} />
      )}
      {imageUrl && <Image style={styles.image} source={{uri: imageUrl}} />}
    </Pressable>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  image: {
    width: 90,
    height: 90,
    backgroundColor: 'lightgray',
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
});
