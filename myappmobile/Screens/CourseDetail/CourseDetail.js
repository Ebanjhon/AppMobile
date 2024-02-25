import { SafeAreaView, View, Text, FlatList, TouchableHighlight, Button, ActivityIndicator, ScrollView, } from "react-native"
import MyStyle from "../../MyStyles/MyStyle"
import CorsDetailStyles from "./CorsDetailStyles";
import { StyleSheet } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useContext, useEffect, useState } from "react";
import API, { endpoints } from "../../config/API";
import MyConText from "../../config/MyConText";


const Course = ({ navigation, route }) => {

    const { classStudyId } = route.params; //dùng để chứa id lớp học
    const [user, dispatch] = useContext(MyConText)
    const [scores, setScores] = useState(null)
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState(null)

    // const handlePress = () => {
    //     let url = (endpoints['scores'](classStudyId));
    //     url = `${url}?student_id=${user.id}`
    //     console.log(url);
    // };

    // gọi api lấy dữ liệu

    useEffect(() => {
        setLoading(true);
        // handlePress()
        const loadScores = async () => {// lấy danh sách điểm
            let url = (endpoints['scores'](classStudyId));

            url = `${url}?student_id=${user.id}`
            // console.log(url);
            try {
                let res = await API.get(url);
                setScores(res.data)
                // console.log(scores)
            } catch (ex) {
                console.error("lỗi: ", ex)
            } finally {
                setLoading(false);
            }
        }
        loadScores()

        const loadPost = async () => {
            try {
                let res = await API.get((endpoints['post'](classStudyId)))
                setPosts(res.data)
                // console.log(posts)
            } catch (err) {
                console.error(err)
            }
        }
        loadPost()
    }, [classStudyId])

    return (
        <View style={{ width: '100%', height: '100%' }}>
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
                            <Text style={styles.cell}>{scores === undefined ? scores[0].midterm_score : ''}</Text>
                        </View>
                        <View style={[styles.row]}>
                            <Text style={styles.cell}>Giữa kỳ</Text>
                            <Text style={styles.cell}>{scores === undefined ? scores[0].midterm_score : ''}</Text>
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
                <Text style={styles.headerText}>Diễn đàn</Text>
                {/* items diễn đàn */}
                <View style={{ height: "80%" }}>
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
                                                borderRadius: 10

                                            }}
                                        >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.title}>Admin: Jhon </Text>
                                                <Text style={[{ marginLeft: 10 }, styles.title]}>MSSV: 123</Text>
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