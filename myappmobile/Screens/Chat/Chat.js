import React, { useState } from 'react'; // Đảm bảo đã import useState từ thư viện react
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ChatHomeScreen = () => {
    const [chats, setChats] = useState([
        { id: '1', title: 'Chat 1', lastMessage: 'Last message 1' },
        { id: '2', title: 'Chat 2', lastMessage: 'Last message 2' },
        { id: '3', title: 'Chat 3', lastMessage: 'Last message 3' },
    ]);

    const renderChatItem = ({ item }) => (
        <View style={styles.chatItem}>
            <Text style={styles.chatTitle}>{item.title}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                renderItem={renderChatItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lastMessage: {
        fontSize: 16,
        color: '#666',
    },
});

export default ChatHomeScreen;
