import { StyleSheet } from "react-native";
import React from 'react';

export default StyleSheet.create({
    container: {
        height: '100%',
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'red'
    },
    header: {
        width: '100%',
        height: 100,
        backgroundColor: '#F5F5F4',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "flex-start",
    },
    body: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#E8E9ED',
        padding: 5
    },
    img: {
        width: 80,
        height: 80,
        borderRadius: 100,
        marginLeft: 10,
    },
    text_name: {
        fontSize: 20,
        fontWeight: '600',
        color: '#3D6F49'
    },
    txt: {
        fontSize: 20,
        fontWeight: '600'
    },
    img_course: {
        width: 100, height: 100,
        borderRadius: 5
    },
    view_course: {
        flexDirection: 'row',
        margin: 5,
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 5
    },
    title_course: {
        fontSize: 22,
        fontWeight: '500'
    },
    title_class: {
        fontSize: 18,
        fontWeight: '400'
    },
    title_view: {
        marginLeft: 5,

    }






});