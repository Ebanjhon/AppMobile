import { StyleSheet } from "react-native";
import React from 'react';

export default StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    viewbox: {
        // flex: 1,
        alignItems: 'center',
        backgroundColor: '#E3E3E3',
        // height
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    content: {
        alignItems: 'center',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    div_info: {
        backgroundColor: '#E7EDEC',
        width: '90%',
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
        padding: 10,
        // borderWidth: 1,
        marginBottom: 20
    },
    txt_infor: {
        fontSize: 19,
        fontWeight: '800',
    }

});