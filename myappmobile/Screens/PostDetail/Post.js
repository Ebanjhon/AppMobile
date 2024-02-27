import { SafeAreaView, ScrollView, View, Text, Image, FlatList, ActivityIndicator, Button, TouchableOpacity, Modal, TextInput } from "react-native"
import PostStyle from "./PostStyle"
import MyStyle from "../../MyStyles/MyStyle"
import { useEffect, useState } from "react";
import API, { authApi, endpoints } from "../../config/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HOST } from "../../config/API";

const Post = ({ route }) => {
    const { postid } = route.params;
    const [loading, setLoading] = useState(false)
    const [comment, setComment] = useState(null)
    const [branch, setBranch] = useState(null)

    const loadPost = async () => {
        try {
            setLoading(true)
            // console.log('3')
            // console.log(endpoints['cmt_add'](postid.id))
            let res = await API.get(endpoints['postDetail'](postid.id));
            // setComment(res.data)
            // console.log(res.data[0].comment_child[0].content)
            setComment(res.data)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    }
    // api lấy post 
    useEffect(() => {
        loadPost()
    }, [postid])//postid

    const [modalVisible, setModalVisible] = useState(false);
    const [content, setContent] = useState('');
    const [cmtPrent, setCmtparent] = useState(null);

    // hàm tạo comment 
    const addCommentParent = () => {
        // thuc hiện api tạo comment 
        const createComment = async () => {
            setLoading(true)
            try {
                let token = await AsyncStorage.getItem('access_token');
                let res = await authApi(token).post(endpoints['cmt_add'](postid.id), { content });
                // console.log(endpoints['cmt_add'](postid.id));
                // console.log(res.status)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
                loadPost()
            }
        };
        createComment();
        setModalVisible(false);
        // Reset giá trị input
        setContent('');
    };

    const addCommentChild = () => {
        console.log('ok')
        // thuc hiện api tạo comment
        const createCommentChild = async () => {
            setLoading(true)
            try {
                let token = await AsyncStorage.getItem('access_token');
                let res = await authApi(token).post(endpoints['reply_add'](cmtPrent), { content, postid })
                // console.log(endpoints['reply_add'](cmtPrent));
                // console.log(res.status)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
                loadPost();
            }
        };

        // useEffect()
        createCommentChild();
        setModalVisible(false);
        // Reset giá trị input
        setContent('');
        setCmtparent(null);
    };


    const branchComment = () => {

        if (branch === 1) {
            addCommentParent();
        } else {
            addCommentChild();
        }
        setBranch(null)
    }

    // hàm set nhánh comment cha là 1
    const setCommnetParent = () => {
        setBranch(1);
        setModalVisible(true);
    }

    const setCommentchild = (parentIdComment) => {
        setBranch(2);
        setCmtparent(parentIdComment);
        setModalVisible(true);
    }

    return (
        <SafeAreaView style={PostStyle.container}>
            {/* phần hiện thị hộp thoại để nhập nội dung commnet  */}
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                            <Text>Nhập nội dung:</Text>
                            <TextInput
                                style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginTop: 10 }}
                                onChangeText={(text) => setContent(text)}
                                value={content}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                                {/* Nút Cancel */}
                                <Button title="Cancel" onPress={() => setModalVisible(false)} />
                                {/* Nút OK */}
                                <Button title="OK" onPress={branchComment} />
                            </View>

                        </View>
                    </View>

                </Modal>
            </View >
            {/* phần nội dung diễn đàn */}
            < View style={{ alignItems: 'center', width: "100%" }}>
                <View style={PostStyle.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            style={{ width: 45, height: 45, borderRadius: 50, marginRight: 10 }}
                            source={postid.user_post.avatar ? { uri: HOST + postid.user_post.avatar } : { uri: 'https://i.vietgiaitri.com/2018/10/9/hinh-anh-minion-ngo-nghinh-de-thuong-dang-yeu-doc-dao-hai-huoc-022394.jpg' }}

                        // source={{ uri: 'https://avatarfiles.alphacoders.com/294/294021.jpg' }}
                        />
                        <Text style={{ fontSize: 15, fontWeight: '500', padding: 5 }}>"({postid.user_post.role})"</Text>
                        <Text style={PostStyle.txt_info}>{postid.user_post.username}</Text>
                    </View>
                    <Text style={{ fontSize: 17, fontWeight: '500' }}>{postid.title}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{postid.content}</Text>
                    <View style={PostStyle.add_comment}>
                        <TouchableOpacity style={PostStyle.button} onPress={setCommnetParent}>
                            <Text>Add comment</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View >
            {/* hiện thị comments  */}
            < View style={{ width: '100%', flex: 1 }}>
                <FlatList
                    data={comment}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (

                        <View style={{ width: '100%', height: 'auto', alignItems: 'center', paddingTop: 4 }}>
                            {item.parent_comment === null ? (
                                <View>
                                    {/* hiện thị comment cha */}
                                    <View style={PostStyle.comment_parent}>
                                        <View style={PostStyle.mui}></View>
                                        <Image
                                            style={{ width: 45, height: 45, borderRadius: 50 }}
                                            source={postid.user_post.avatar ? { uri: HOST + postid.user_post.avatar } : { uri: 'https://i.vietgiaitri.com/2018/10/9/hinh-anh-minion-ngo-nghinh-de-thuong-dang-yeu-doc-dao-hai-huoc-022394.jpg' }}
                                        />

                                        <View style={PostStyle.info}>
                                            <Text style={PostStyle.txt_info}><Text style={{ fontSize: 14, fontWeight: '400' }} >"({item.user_comment.role})"</Text>  {item.user_comment.username}</Text>
                                            <Text style={PostStyle.txt_content}>{item.content}</Text>
                                        </View>
                                    </View>
                                    <View style={PostStyle.com}>
                                        <TouchableOpacity onPress={() => setCommentchild(item.id)}>
                                            <Text>Comment</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Hiển thị comment con */}
                                    {item.comment_child.map((child) => (
                                        <View key={child.id} style={[{ marginLeft: 20, marginTop: 5 }, PostStyle.comment_chil]}>
                                            <View style={PostStyle.mui}></View>
                                            <Image
                                                style={{ width: 45, height: 45, borderRadius: 50 }}
                                                source={postid.user_post.avatar ? { uri: HOST + postid.user_post.avatar } : { uri: 'https://i.vietgiaitri.com/2018/10/9/hinh-anh-minion-ngo-nghinh-de-thuong-dang-yeu-doc-dao-hai-huoc-022394.jpg' }}
                                            />
                                            <View style={PostStyle.info}>
                                                <Text style={PostStyle.txt_info}><Text style={{ fontSize: 14, fontWeight: '400' }} >"({child.user_comment.role})"</Text> {child.user_comment.username}</Text>
                                                <Text style={PostStyle.txt_content}>{child.content}</Text>
                                            </View>
                                        </View>
                                    ))}



                                </View>
                            ) : (
                                <View></View>
                            )}
                        </View>

                    )}
                />
            </View >
        </SafeAreaView >
    )
}


export default Post