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
        backgroundColor: '#DDDDDD',
        padding: 18,
        width: '100%'
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },

});