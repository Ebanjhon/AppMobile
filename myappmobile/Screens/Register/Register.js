import React, { useContext, useState } from "react"
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Button, Image, Alert } from "react-native"
import RegisterStyles from "./RegisterStyles";
import DatePicker from "react-native-datepicker";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios, { Axios } from "axios";
import API, { authApi, endpoints } from "../../config/API";
import { encode as base64encode } from 'base-64'; // Import hàm encode từ thư viện base-64
import MyConText from "../../config/MyConText";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';



const Register = ({ navigation }) => {

    const [grantType, setGrantType] = useState('password');
    const [clientId, setClientId] = useState('Thx78p5fDt70s30FvYGKk4dqSlGx6hfxSigsT4uh');
    const [clientSecret, setClientSecret] = useState('FtxskgJQ50ua0mQ2OklKWPUphDUOtROoe2XF7Ak4LkeEzZJHpipOWsQbnJ7Es5Dv3HzhDGyGBGO4s4Rk4pGl0s5x15BkBj1L5cJhPpUPuVevU7r20zhpw8HPMHN4K5If');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [first_name, setfirst_name] = useState('');
    const [last_name, setlast_name] = useState('');
    const [address, setAndress] = useState('');
    const [date, setDate] = useState(new Date());
    const [birth_date, setBirtdate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [user, dispatch] = useContext(MyConText)
    const [avatar, setAvatar] = useState();
    const [upload_avatar, setUploadAvatar] = useState();

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        // Thêm số 0 vào trước tháng và ngày nếu cần
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        return `${year}-${month}-${day}`;
    }
    // thực hiện lấy thông tin và token
    const getToken = async (grantType, clientId, clientSecret, username, password) => {
        try {
            // setLoading(true);
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
            dispatch({
                type: "login",
                payload: user.data
            });
            console.log(user.data)
            navigation.navigate('Nav')
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
        } finally {
            // setLoading(false);
        }
    };

    // thực hiện chuyển đổi ảnh
    const imageToBase64 = async (imageUri) => {
        try {
            // Đọc nội dung của tệp hình ảnh
            let response = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            // Trả về dữ liệu base64
            // console.log(response)
            return response;
        } catch (error) {
            console.error("Error converting image to base64:", error);
            return null;
        }
    };

    // thực hiện lấy ảnh
    const pickImage = async () => {
        let { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {// nếu không bấm cancel
                setAvatar(result.assets[0]);
                console.log(result.assets[0])
                setUploadAvatar(avatar);
            }
        }
    }

    function isValidEmail(email) {
        // Sử dụng biểu thức chính quy để so khớp mẫu của email
        const emailPattern = /@ou\.edu\.vn$/;
        return emailPattern.test(email);
    }

    // thuc hiện gửi request đăng ký
    const handlePress = async () => {
        if (avatar == null)
            Alert.alert('Thông báo!', 'Vui lòng chọn ảnh để đăng ký!', [{ text: 'Ok' }])
        else if (!isValidEmail(email)) {
            Alert.alert('Thông báo!', 'Email bạn nhập không phải email của trường',
                [{ text: 'Ok', onPress: () => console.log('alert colesd') }])
        } else {
            try {
                const response = await fetch('https://nmau4669.pythonanywhere.com/User/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password, email, address, first_name, last_name, avatar: avatar.uri }),
                });

                console.log('Registration successful');
                getToken(grantType, clientId, clientSecret, username, password);
            } catch (error) {
                console.error(error)
            }
        }

    };

    return (
        <SafeAreaView style={{ justifyContent: 'center' }}>
            <ScrollView>
                <View style={RegisterStyles.container}>

                    <Text style={{ fontWeight: '800', fontSize: 45 }}>WELLCOME</Text>

                    <View style={RegisterStyles.form_input}>
                        <View style={RegisterStyles.title_view}>
                            <Text style={RegisterStyles.title_text}>Tên người dùng</Text>
                        </View>
                        <TextInput
                            style={RegisterStyles.input}
                            onChangeText={setUsername}
                            value={username}
                            placeholder="User name"
                        />
                    </View>

                    <View style={RegisterStyles.form_input}>
                        <View style={RegisterStyles.title_view}>
                            <Text style={RegisterStyles.title_text}>Tên</Text>
                        </View>
                        <TextInput
                            style={RegisterStyles.input}
                            onChangeText={setfirst_name}
                            value={first_name}
                            placeholder="First name"
                        />
                    </View>

                    <View style={RegisterStyles.form_input}>
                        <View style={RegisterStyles.title_view}>
                            <Text style={RegisterStyles.title_text}>Họ</Text>
                        </View>
                        <TextInput
                            style={RegisterStyles.input}
                            onChangeText={setlast_name}
                            value={last_name}
                            placeholder="Lastname"
                        />
                    </View>

                    <View style={RegisterStyles.form_input}>
                        <View style={RegisterStyles.title_view}>
                            <Text style={RegisterStyles.title_text}>Email</Text>
                        </View>
                        <TextInput
                            style={RegisterStyles.input}
                            onChangeText={setEmail}
                            value={email}
                            placeholder="Email"
                        />
                    </View>

                    <View style={RegisterStyles.form_input}>
                        <View style={RegisterStyles.title_view}>
                            <Text style={RegisterStyles.title_text}>địa chỉ</Text>
                        </View>
                        <TextInput
                            style={RegisterStyles.input}
                            onChangeText={setAndress}
                            value={address}
                            placeholder="Andress"
                        />
                    </View>

                    <View style={RegisterStyles.form_input}>
                        <View style={RegisterStyles.title_view}>
                            <Text style={RegisterStyles.title_text}>ngày sinh</Text>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderWidth: 1, width: '80%', borderRadius: 30 }}>
                            <Text style={{ fontSize: 18, padding: 10, }}>{date.toDateString()}</Text>
                            <Button title="Chọn ngày sinh" onPress={() => setShowDatePicker(true)} />

                            {showDatePicker && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode="date"
                                    is24Hour={true}
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}

                        </View>

                    </View>

                    <View style={RegisterStyles.form_input}>
                        <View style={RegisterStyles.title_view}>
                            <Text style={RegisterStyles.title_text}>Mật khẩu</Text>
                        </View>
                        <TextInput
                            style={RegisterStyles.input}
                            onChangeText={setPassword}
                            value={password}
                            placeholder="password"
                            secureTextEntry={true}
                        />
                    </View>

                    <View style={[RegisterStyles.form_input, { flexDirection: 'row', justifyContent: 'space-evenly' }]}>
                        <Button title="Chọn ảnh..." onPress={pickImage} />
                        {avatar ? <Image source={{ uri: avatar.uri }} style={{ width: 100, height: 100 }} /> : ""}
                    </View>

                    <TouchableOpacity style={[RegisterStyles.button, { marginBottom: 100 }]} onPress={handlePress}>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>Đăng Ký</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </SafeAreaView>

    )
}

export default Register