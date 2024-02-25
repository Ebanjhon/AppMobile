import { SafeAreaView, View, Text, Image, StyleSheet, Button } from 'react-native';
import MyStyle from "../../MyStyles/MyStyle"
import ProfileStyles from './ProfileStyles';
import { useContext } from 'react';
import MyConText from '../../config/MyConText';
import { HOST } from '../../config/API';


const Profile = ({ navigation }) => {
    const [user, dispatch] = useContext(MyConText)

    const logout = () => {
        dispatch({
            type: "logout",
        });
        navigation.navigate('Login')
    };

    return (
        <SafeAreaView style={MyStyle.topbar}>
            <View style={[{ width: '100%', height: 100 }]}>
                <View style={ProfileStyles.viewbox}>
                    <Image
                        source={user.avatar ? { uri: HOST + user.avatar } : { uri: 'https://i.vietgiaitri.com/2018/10/9/hinh-anh-minion-ngo-nghinh-de-thuong-dang-yeu-doc-dao-hai-huoc-022394.jpg' }}
                        style={ProfileStyles.avatar}
                    />
                    <View style={ProfileStyles.content}>
                        <Text style={ProfileStyles.username}>{user.username}</Text>
                        <Text>"({user.role})" MSSV: {user.id_user}</Text>
                    </View>

                    <View style={ProfileStyles.div_info}>
                        <Text style={ProfileStyles.txt_infor}>Full name: {user.first_name} {user.last_name}</Text>
                    </View>

                    <View style={ProfileStyles.div_info}>
                        <Text style={ProfileStyles.txt_infor}>Adress: {user.address}</Text>
                    </View>

                    <View style={ProfileStyles.div_info}>
                        <Text style={ProfileStyles.txt_infor}>Birt date: {user.birth_date}</Text>
                    </View>

                    <View style={ProfileStyles.div_info}>
                        <Text style={ProfileStyles.txt_infor}>Email: {user.email}</Text>
                    </View>


                    <Button
                        title='Logout'
                        onPress={logout}
                    />

                </View>
            </View >
        </SafeAreaView >
    )
}

export default Profile