import { StyleSheet } from "react-native";
import React from 'react';

export default StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    form: {
        width: '85%',
        height: '80%',
        flexDirection: 'column',
        // justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: 'blue',
    },
    scroll: {
        flex: 1,
        width: '100%',
        height: '100%',
        // backgroundColor: 'red',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        width: 180,
        height: 180,
        borderRadius: 100,
    },
    text: {
        fontWeight: '900',
    },
    text_reigister: {
        fontSize: 19,
        fontWeight: '800',

    },
    input: {
        width: '100%',
        height: '10%',
        borderWidth: 1,
        fontSize: 20,
        margin: 10
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#406E49',
        padding: 18,
        width: '100%',
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 2,
        borderColor: '#1F3524',
        padding: 10,
        backgroundColor: '#D2DDD5',
        borderRadius: 10,
        shadowColor: 'black',
        fontSize: 20,
        fontWeight: '700',
        color: "#1F3D29",
    },
    login_txt: {
        fontSize: 25,
        fontWeight: '700',
        color: "#F5F5F5"
    }

});