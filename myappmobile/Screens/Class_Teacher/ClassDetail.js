import { SafeAreaView, View, Text, FlatList, Modal, TextInput, TouchableHighlight, Button, ActivityIndicator, ScrollView, } from "react-native"
import MyStyle from "../../MyStyles/MyStyle"
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useContext, useEffect, useState } from "react";
import API, { endpoints, authApi } from "../../config/API";
import MyConText from "../../config/MyConText";
import ClassStyles from "./ClassStyles";
import AddScores from "../InoutScores/InputScores";


const ClassDetail = ({ navigation, route }) => {

    const { classStudyId } = route.params; //dùng để chứa id lớp học
    const [user, dispatch] = useContext(MyConText)
    const [scores, setScores] = useState(null)
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState(null)
    // các thông tin sau khi nhập nội dung
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // lấy dữ liệu bai viết 
    const loadPost = async () => {
        try {
            let res = await API.get((endpoints['post'](classStudyId)))
            setPosts(res.data)
            // console.log(posts)
        } catch (err) {
            console.error(err)
        }
    }

    // api tạo post 
    const createPost = async () => {
        try {
            let token = await AsyncStorage.getItem('access_token');
            let res = await authApi(token).post(endpoints['add_post'](classStudyId), { content, title });
        } catch (error) {
            console.error(error)
        } finally {
            setModalVisible(false);
            loadPost()
            setContent('')
            setTitle('')
        }
    };

    useEffect(() => {
        loadPost()
    }, [classStudyId])

    return (
        <View style={{ width: '100%', height: '100%' }}>
            {/* box để nhập thông tin  */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={{ marginTop: 0, backgroundColor: '#034078', height: '100%' }}>
                    <View style={ClassStyles.content_input}>
                        <Text style={styles.headerText}>Nhập tiêu đề:</Text>
                        <TextInput
                            onChangeText={text => setTitle(text)}
                            value={title}
                            placeholder="Nhập tiêu đề..."
                            style={ClassStyles.txtTitle}
                        />
                        <Text style={styles.headerText}>Nhập nội dung:</Text>
                        <TextInput
                            onChangeText={text => setContent(text)}
                            value={content}
                            placeholder="Nhập nội dung..."
                            multiline={true}
                            style={ClassStyles.txtcontent}
                            numberOfLines={4}
                        />
                    </View>
                    <View style={ClassStyles.but_add_content}>
                        <TouchableHighlight onPress={() => setModalVisible(false)}
                            style={[ClassStyles.but_add, ClassStyles.cancel]}>
                            <Text style={ClassStyles.txt_OK_Cancel}>Hủy</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={createPost}
                            style={[ClassStyles.but_add, ClassStyles.ok]}>
                            <Text style={ClassStyles.txt_OK_Cancel}>Đăng bài</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>

            {/* danh sách điểm */}
            <View style={[styles.container]}>
                <View style={ClassStyles.view_info_class}>
                    <TouchableHighlight style={ClassStyles.button_add_score} onPress={() => navigation.navigate('ShowListStudent', { 'classStudyId': classStudyId })}>
                        <Text style={ClassStyles.but_text}>Xem danh sách sinh viên</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={ClassStyles.button_add_score} onPress={() => navigation.navigate('AddScores', { 'classStudyId': classStudyId })}>
                        <Text style={ClassStyles.but_text}>Nhập điểm sinh viên</Text>
                    </TouchableHighlight>
                </View>
            </View >
            {/* phần list diễn đàn */}
            < View style={{ width: '100%', alignItems: 'center' }}>
                {/* // phần thêm diễn đàn */}
                <Text style={styles.headerText}>Diễn đàn</Text>

                <View style={ClassStyles.button}>
                    <TouchableOpacity style={ClassStyles.but} onPress={() => setModalVisible(true)}>
                        <Text style={ClassStyles.text_button}>
                            Thêm bài viết...
                        </Text>
                    </TouchableOpacity>
                </View>


                {/* items diễn đàn */}
                <View style={{ height: '100%', width: '100%' }}>
                    <FlatList
                        data={posts}
                        style={{ width: '100%' }}
                        renderItem={({ item }) => (
                            <TouchableHighlight onPress={() => navigation.navigate('Post', { 'postid': item })}>
                                <View style={styles.post}>
                                    <GestureHandlerRootView style={{ width: '100%', height: 100 }}>
                                        <LinearGradient
                                            colors={['#F2EFE5', '#B4B4B8']}
                                            start={{ x: 0.2, y: 5 }} // Điểm bắt đầu của gradient
                                            end={{ x: 2, y: -1 }}
                                            style={{
                                                flex: 1,
                                                borderRadius: 5, // Độ cong của viền
                                                overflow: 'hidden', // Ẩn nội dung bên ngoài đường viền
                                                borderWidth: 2, // Độ dày của đường viền
                                                borderColor: 'black', // Màu sắc của đường viền
                                                padding: 5,
                                                borderRadius: 10,
                                                width: '100%'
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.title}>{item.user_post.role}: {item.user_post.username} </Text>
                                                <Text style={[{ marginLeft: 10 }, styles.title]}>MSSV: {item.user_post.id_user}</Text>
                                            </View>
                                            <Text style={styles.title}>Tiêu đề: {item.title}</Text>
                                            <Text style={styles.text_post}>Nội dung: {item.content} </Text>
                                        </LinearGradient>
                                    </GestureHandlerRootView>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                </View>
            </View >
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        paddingRight: 16,
        paddingLeft: 16,
        width: '100%',
        height: '20%',
        minHeight: 100,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#B80000'
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        // borderBottomWidth: 1
    },
    cell: {
        fontSize: 16,
    },
    post: {
        width: '100%',
        height: 100,
        padding: 5,
        // backgroundColor: 'red',
        // borderRadius: 10,
        marginBottom: 10,
    },
    text_post: {
        fontSize: 17,
        fontWeight: '600'
    },
    title: {
        fontSize: 15,
        fontWeight: '500'

    },

});

export default ClassDetail