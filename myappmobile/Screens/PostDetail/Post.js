import { SafeAreaView, ScrollView, View, Text, Image, FlatList, ActivityIndicator } from "react-native"
import PostStyle from "./PostStyle"
import MyStyle from "../../MyStyles/MyStyle"
import { useEffect, useState } from "react";
import API, { endpoints } from "../../config/API";

// function tachCommentChaVaCon(data) {
//     const chaVaCon = {};

//     data.forEach(comment => {
//         const { id, parent_comment } = comment;

//         if (parent_comment === null) {
//             chaVaCon[id] = { ...comment, children: [] };
//         } else {
//             if (!chaVaCon[parent_comment]) {
//                 chaVaCon[parent_comment] = { children: [] };
//             }
//             chaVaCon[parent_comment].children.push(comment);
//         }
//     });

//     const commentsCha = Object.values(chaVaCon).filter(comment => comment.parent_comment === null);

//     return commentsCha;
// }

const Post = ({ route }) => {
    const { postid } = route.params;
    const [loading, setLoading] = useState(false)
    const [comment, setComment] = useState(null)
    const [post, setPost] = useState(null)


    function tachCommentChaVaCon(data) {
        const chaVaCon = {};

        data.forEach(comment => {
            const { id, parent_comment } = comment;

            if (parent_comment === null) {
                chaVaCon[id] = { ...comment, children: [] };
            } else {
                if (!chaVaCon[parent_comment]) {
                    chaVaCon[parent_comment] = { children: [] };
                }
                chaVaCon[parent_comment].children.push(comment);
            }
        });

        const commentsCha = Object.values(chaVaCon).filter(comment => comment.parent_comment === null);

        return commentsCha;
        console.log(commentsCha)
    }

    useEffect(() => {
        setLoading(true)
        const loadPost = async () => {
            try {
                console.log(postid.id)
                let res = await API.get(endpoints['postDetail'](postid.id));
                setPost(res.data)
                console.log(post)
                setComment(tachCommentChaVaCon(post))
                comment = tachCommentChaVaCon(post)
                console.log("ok")
                console.log(comment[0].children[0].content)
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false)
            }
        }
        loadPost()

    }, [])

    return (
        <SafeAreaView style={PostStyle.container}>

            <FlatList
                style={{ width: '100%' }}
                ListHeaderComponent={
                    <View style={{ alignItems: 'center' }}>
                        <View style={PostStyle.header}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Image
                                    style={{ width: 45, height: 45, borderRadius: 50, marginRight: 10 }}
                                    source={{ uri: 'https://avatarfiles.alphacoders.com/294/294021.jpg' }}
                                />
                                <Text style={{ fontSize: 15, fontWeight: '500' }}>"(admin)"</Text>
                                <Text style={PostStyle.txt_info}>Eban Jhon Y</Text>
                            </View>
                            <Text style={{ fontSize: 17, fontWeight: '500' }}>{postid.title}</Text>
                            <Text style={{ fontSize: 16, fontWeight: '500' }}>{postid.content}</Text>
                        </View>

                        <View style={{ width: '90%', height: 1.1, backgroundColor: 'black', marginBottom: 10 }}></View>
                    </View>
                }

                data={comment}
                renderItem={({ item }) => (
                    <View style={{ width: '100%' }}>

                        {/* phần bình luận cha */}
                        <View style={{ width: '100%', height: 'auto', alignItems: 'center', paddingTop: 10 }}>
                            <View style={PostStyle.comment_parent}>
                                <View style={PostStyle.mui}></View>
                                <Image
                                    style={{ width: 45, height: 45, borderRadius: 50 }}
                                    source={{ uri: 'https://avatarfiles.alphacoders.com/294/294021.jpg' }}
                                />
                                <View style={PostStyle.info}>
                                    <Text style={PostStyle.txt_info}>{item.user_comment.role}: {item.user_comment.username}</Text>
                                    <Text style={PostStyle.txt_content}>{item.content}</Text>
                                </View>
                            </View>
                            {/* phần bình luận con  */}
                            <FlatList
                                data={item.children} // Dữ liệu để hiển thị trong danh sách
                                renderItem={({ items }) => (
                                    <View style={PostStyle.comment_chil}>
                                        <Image
                                            style={{ width: 45, height: 45, borderRadius: 50 }}
                                            source={{ uri: 'https://avatarfiles.alphacoders.com/294/294021.jpg' }}
                                        />
                                        <View style={PostStyle.info}>
                                            {/* <Text style={PostStyle.txt_info}>Admin: username</Text> */}
                                            <Text style={PostStyle.txt_content}>
                                                {items.id == undefined ? '1' : '2'}

                                            </Text>
                                        </View>
                                    </View>

                                )} // Hàm render cho mỗi mục
                                keyExtractor={item => item.key} // Hàm để trích xuất key của mỗi mục
                            />

                        </View>
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
            />
        </SafeAreaView >
    )
}


export default Post