import { SafeAreaView, View, Text, FlatList, Modal, TextInput, TouchableHighlight, Button, ActivityIndicator, ScrollView, } from "react-native"
import MyStyle from "../../MyStyles/MyStyle"
import CorsDetailStyles from "./CorsDetailStyles";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useContext, useEffect, useState } from "react";
import API, { endpoints, authApi } from "../../config/API";
import MyConText from "../../config/MyConText";


const Course = ({ navigation, route }) => {

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

    // gọi api lấy dữ liệu lấy danh sách điểm
    const loadScores = async () => {
        let url = (endpoints['scores'](classStudyId));

        url = `${url}?student_id=${user.id}`
        // console.log(url);
        try {
            let res = await API.get(url);
            setScores(res.data)
            console.log(scores[0])
        } catch (ex) {
            console.error("lỗi: ", ex)
        } finally {
            setLoading(false);
        }
    };

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
        setLoading(true);
        loadScores();
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
                    <View style={CorsDetailStyles.content_input}>
                        <Text style={styles.headerText}>Nhập tiêu đề:</Text>
                        <TextInput
                            onChangeText={text => setTitle(text)}
                            value={title}
                            placeholder="Nhập tiêu đề..."
                            style={CorsDetailStyles.txtTitle}
                        />
                        <Text style={styles.headerText}>Nhập nội dung:</Text>
                        <TextInput
                            onChangeText={text => setContent(text)}
                            value={content}
                            placeholder="Nhập nội dung..."
                            multiline={true}
                            style={CorsDetailStyles.txtcontent}
                            numberOfLines={4}
                        />
                    </View>
                    <View style={CorsDetailStyles.but_add_content}>
                        <TouchableHighlight onPress={() => setModalVisible(false)}
                            style={[CorsDetailStyles.but_add, CorsDetailStyles.cancel]}>
                            <Text style={CorsDetailStyles.txt_OK_Cancel}>Hủy</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={createPost}
                            style={[CorsDetailStyles.but_add, CorsDetailStyles.ok]}>
                            <Text style={CorsDetailStyles.txt_OK_Cancel}>Đăng bài</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>

            {/* danh sách điểm */}
            <View style={[styles.container]}>
                <View style={{ width: '90%' }}>
                    <View style={[styles.header]}>
                        <Text style={styles.headerText}>Cột điểm</Text>
                        <Text style={styles.headerText}>Điểm số</Text>
                    </View>
                    <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <View style={[styles.row]}>
                            <Text style={styles.cell}>Cuối kỳ</Text>
                            {/* <Text style={styles.cell}>{scores === undefined ? scores[0].final_score : scores[0].final_score}</Text> */}
                        </View>
                        <View style={[styles.row]}>
                            <Text style={styles.cell}>Giữa kỳ</Text>
                            {/* <Text style={styles.cell}>{scores === undefined ? scores[0].midterm_score : scores.midterm_score}</Text> */}
                        </View>
                    </View>

                    {loading === true ? <ActivityIndicator /> : <>
                        <FlatList
                            data={scores}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={{ padding: 10, paddingTop: 0, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                    {/* cot diem cong */}
                                    <FlatList
                                        data={item.score_columns}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <View style={[styles.row]}>
                                                <Text style={styles.cell}>{item.name_column}</Text>
                                                <Text style={styles.cell}>{item.result_learning}</Text>
                                            </View>
                                        )}
                                    />
                                </View>
                            )}
                        />
                    </>}
                </View>
            </View >
            {/* phần list diễn đàn */}
            < View style={{ width: '100%', alignItems: 'center' }}>
                {/* // phần thêm diễn đàn */}
                <Text style={styles.headerText}>Diễn đàn</Text>

                <View style={CorsDetailStyles.button}>
                    <TouchableOpacity style={CorsDetailStyles.but} onPress={() => setModalVisible(true)}>
                        <Text style={CorsDetailStyles.text_button}>
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
                                    <GestureHandlerRootView style={{ width: '100%', height: 100, }}>
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
        height: '29%',
        minHeight: 100,
        alignContent: 'center',
        alignItems: 'center'
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

export default Course