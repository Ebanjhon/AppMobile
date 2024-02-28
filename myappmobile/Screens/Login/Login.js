import LoginStyles from "./LoginStyles"
import React, { useContext, useState, useEffect, useReducer, useCallback } from 'react';
import API, { authApi, endpoints } from "../../config/API";
import { encode as base64encode } from 'base-64'; // Import hàm encode từ thư viện base-64
import {
    SafeAreaView,
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Button,
    ActivityIndicator,
    Alert,

} from 'react-native';
import MyConText from "../../config/MyConText";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';



const Login = ({ navigation }) => {

    const [grantType, setGrantType] = useState('password');
    const [clientId, setClientId] = useState('Thx78p5fDt70s30FvYGKk4dqSlGx6hfxSigsT4uh');
    const [clientSecret, setClientSecret] = useState('FtxskgJQ50ua0mQ2OklKWPUphDUOtROoe2XF7Ak4LkeEzZJHpipOWsQbnJ7Es5Dv3HzhDGyGBGO4s4Rk4pGl0s5x15BkBj1L5cJhPpUPuVevU7r20zhpw8HPMHN4K5If');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = useState(false);

    const [user, dispatch] = useContext(MyConText)


    const handleGetToken = () => {
        getToken(grantType, clientId, clientSecret, username, password);
    };

    const getToken = async (grantType, clientId, clientSecret, username, password) => {
        try {
            setLoading(true);
            const bodyParams = grantType === 'password' ? `grant_type=password&username=${username}&password=${password}` : 'grant_type=client_credentials';
            const authHeader = `Basic ${base64encode(`${clientId}:${clientSecret}`)}`; // Mã hóa clientId và clientSecret thành chuỗi base64
            const response = await fetch('https://nmau4669.pythonanywhere.com/o/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': authHeader
                },
                body: bodyParams,
            });
            const data = await response.json();
            let user = await authApi(data.access_token).get(endpoints['current_user']);
            // lưu token vào bộ nhớ thiết bị
            try {
                await AsyncStorage.setItem('access_token', data.access_token);
                console.log('Đã lưu tên thành công vào AsyncStorage');
            } catch (error) {
                console.error('Lỗi khi lưu tên vào AsyncStorage:', error);
            }
            dispatch({
                type: "login",
                payload: user.data
            });
            navigation.navigate('Nav')
        } catch (error) {

            Alert.alert('Thông báo!', 'Mật khẩu hoặc tên đăng nhập không chính xác',
                [{ text: 'Dạ', onPress: () => console.log('alert colesd', error) }])

            // console.error('Lỗi đăng nhập:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            if (user && (user.id !== 0)) {
                navigation.navigate('Nav');
            }
        })
    );

    return (
        <SafeAreaView style={LoginStyles.container}>
            <ScrollView contentContainerStyle={LoginStyles.scroll} keyboardShouldPersistTaps="handled">
                <View style={LoginStyles.form}>
                    <Image
                        style={LoginStyles.img}
                        source={{ uri: 'https://avatarfiles.alphacoders.com/294/294021.jpg' }}
                    />
                    <Text style={[LoginStyles.text, { fontSize: 30 }]}>LOGIN</Text>
                    <View style={{ width: '100%', height: 110, justifyContent: "space-between", alignItems: 'center', margin: 10 }}>
                        {/* <Icon name="user" size={20} color="#000" style={{ marginRight: 10 }} /> */}
                        <TextInput
                            style={LoginStyles.input}
                            onChangeText={setUsername}
                            value={username}
                            placeholder="Nhập username"
                        />

                        <TextInput
                            style={LoginStyles.input}
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Nhập mật khẩu"
                            secureTextEntry={true}
                        />
                    </View>


                    {loading === true ? <ActivityIndicator /> : <>
                        <TouchableOpacity style={LoginStyles.button}
                            onPress={handleGetToken}
                        >
                            <Text style={LoginStyles.login_txt} >Đăng nhập</Text>
                        </TouchableOpacity>
                    </>}

                    <View style={{ alignItems: 'flex-end', width: '100%', padding: (0, 15) }}>
                        <Text style={{ color: 'blue', fontSize: 17, fontWeight: '700' }} onPress={() => navigation.navigate('Register')}>Đăng ký tai khoản</Text>
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView >
    )
}

export default Login
