import { Button, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, FlatList, ActivityIndicator } from "react-native"
import HomeStyles from "./HomeStyles"
import MyStyle from "../../MyStyles/MyStyle"
import React, { useState, useEffect, useReducer, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import API, { endpoints } from "../../config/API";
import MyConText from "../../config/MyConText";
import { HOST } from "../../config/API";

const Home = ({ route, navigation }) => {
    const [classStydy, setClassStudy] = useState(null);
    // lấy id user 
    const [user, dispatch] = useContext(MyConText)
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (user !== null) {
                    return true; // Chặn quay lại màn hình trước đó
                }
                return false; // Cho phép quay lại màn hình trước đó
            };

            // Gắn sự kiện lắng nghe nút back
            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => backHandler.remove(); // Loại bỏ sự kiện lắng nghe khi màn hình không còn focus
        }, [])
    );

    // lấy dữ liệu lớp học
    useEffect(() => {
        const loadClass = async () => {
            setLoading(true)
            try {
                let res = await API.get(endpoints['study_class'](user.id));
                setClassStudy(res.data)
                // console.log(classStydy)
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false)
            }
        }
        loadClass();
    }, [])

    return (
        <SafeAreaView style={MyStyle.topbar}>

            <View style={HomeStyles.container}>
                {/* header screen*/}
                <View style={HomeStyles.header}>
                    <Image
                        style={HomeStyles.img}
                        source={user.avatar ? { uri: HOST + user.avatar } : { uri: 'https://i.vietgiaitri.com/2018/10/9/hinh-anh-minion-ngo-nghinh-de-thuong-dang-yeu-doc-dao-hai-huoc-022394.jpg' }}
                    />

                    <View style={{ marginLeft: 10 }}>
                        <Text style={HomeStyles.text_name}>Hello {user.first_name} {user.last_name}</Text>
                        <Text>{user.role}</Text>
                    </View>
                    <View>

                    </View>
                </View>
                {/* body screen danh sach khoa học*/}

                {loading === true ? <ActivityIndicator /> : <>
                    <FlatList
                        style={HomeStyles.body}
                        ListHeaderComponent={
                            <View>
                                <Text style={HomeStyles.text_name}>Danh sách các lớp học:</Text>
                            </View>

                        }
                        data={classStydy}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate('Course', { 'classStudyId': item.id })}>
                                <View style={HomeStyles.view_course}>

                                    <Image
                                        style={HomeStyles.img_course}
                                        source={item.course.image ? { uri: HOST + item.course.image } : { uri: 'https://i.pinimg.com/564x/03/e6/ec/03e6ec49164bb4a8586d862345eae049.jpg' }}
                                    />
                                    <View style={HomeStyles.title_view}>
                                        <Text style={HomeStyles.title_course}>{item.name}</Text>
                                        <Text style={HomeStyles.title_class}>Môn: {item.course.name}</Text>
                                        <Text style={HomeStyles.title_class}>Mã môn học: {item.id}</Text>
                                        <Text style={HomeStyles.title_class}>Học kỳ: {item.semester.schoolyear}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id.toString()}
                    />
                </>}


            </View>




        </SafeAreaView>
    )

}

export default Home