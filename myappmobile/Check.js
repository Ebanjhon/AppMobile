import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import crypto from 'crypto-js';

const App = () => {
    const [image, setImage] = useState();

    const pickImage = async () => {
        let { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.cancelled) {
                setImage(result.assets[0]);
                uploadImage(result.assets[0]);
            }
        }
    }

    const uploadImage = async (photo) => {
        const formData = new FormData();
        formData.append('file', {
            uri: photo.uri,
            type: 'image/jpeg', // hoặc 'image/png' tùy vào định dạng của ảnh
            name: 'photo.jpg',
        });
        formData.append('upload_preset', 'din9naro'); // Thay thế YOUR_UPLOAD_PRESET bằng upload preset của bạn trên Cloudinary

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/drosiimsz/image/upload', // Thay thế YOUR_CLOUD_NAME bằng tên cloud của bạn trên Cloudinary
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + generateToken()
                    }
                }
            );
            console.log('Upload successful: ', response.data);
        } catch (error) {
            console.error('Upload failed: ', error);
        }
    };

    const generateToken = () => {
        const timestamp = Math.floor(Date.now() / 1000);
        const apiKey = '789493436969451'; // Thay thế YOUR_API_KEY bằng API key của bạn từ tài khoản Cloudinary
        const apiSecret = '18lxkfupfx2p4EoBZl7H7e-wdGk'; // Thay thế YOUR_API_SECRET bằng API secret của bạn từ tài khoản Cloudinary
        const signature = crypto.HmacSHA1('timestamp=' + timestamp, apiSecret).toString();
        return apiKey + ':' + timestamp + ':' + signature;
    };

    return (
        <View style={styles.container}>
            <Button title="Take a Photo" onPress={pickImage} />

            {image && <Image source={{ uri: image.uri }} style={{ width: 10, height: 10 }} />}
        </View >
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




const imageToBase64 = async (imageUri) => {
    try {
        // Đọc nội dung của tệp hình ảnh
        let response = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        // Trả về dữ liệu base64
        console.log(response)
        return response;
    } catch (error) {
        console.error("Error converting image to base64:", error);
        return null;
    }
};