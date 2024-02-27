import { StyleSheet } from "react-native";
import React from 'react';

const BGcolor = '#DDDDDD';
const comment = '#bdc3c7';
const post = '#D3CCE3';

export default StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: BGcolor,
    },
    header: {
        width: '90%',
        height: 'auto',
        backgroundColor: post,
        margin: 10,
        borderRadius: 10,
        padding: 10
    },
    comment_parent: {
        width: '90%',
        height: 'auto',
        backgroundColor: comment,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        // backgroundColor: 'red'
    },
    comment_chil: {
        width: '80%',
        height: 'auto',
        backgroundColor: comment,
        borderRadius: 10,
        padding: 10,
        marginLeft: '10%',
        flexDirection: 'row',
        // backgroundColor: 'blue'

    },
    mui: {
        width: 20,
        height: 20,
        backgroundColor: comment,
        position: 'absolute'
    },
    info: {
        width: '83%',
        height: '100%',
        backgroundColor: comment,
        marginLeft: 5,
        padding: 5
    },
    txt_info: {
        fontSize: 20,
        fontWeight: '500',
    },
    txt_content: {
        fontSize: 18,
        fontWeight: '400'
    },
    add_comment: {
        height: 30,
        backgroundColor: 'red',
        borderRadius: 50,
    },
    button: {
        backgroundColor: '#3498db',
        borderRadius: 5,
        alignItems: 'center',
        height: 30,
        borderRadius: 50,
        justifyContent: 'center'
    },
    com: {
        // backgroundColor: 'red',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderRadius: 50
    }
});