import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';


const App = () => {
    const [imageUri, setImageUri] = useState(null);

    const handleLaunchCamera = async () => {
        try {
            const options = {
                mediaType: 'photo', // Chỉ chụp ảnh, không quay video
                quality: 0.5, // Chất lượng ảnh, từ 0 đến 1
            };

            const response = await ImagePicker.launchCamera(options);

            if (!response.didCancel) {
                // Nếu người dùng không hủy chụp ảnh
                setImageUri(response.uri);
            }
        } catch (error) {
            console.log('Error launching camera: ', error);
        }
    };

    return (
        <View style={styles.container}>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            <Button title="Take a Photo" onPress={handleLaunchCamera} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
});

export default App;
