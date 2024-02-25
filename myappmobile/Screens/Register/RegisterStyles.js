import { StyleSheet } from "react-native";
import React from 'react';

export default StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    form_input: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 20,

    },
    input: {
        width: '80%',
        // margin: 12,
        borderWidth: 1,
        fontSize: 18,
        padding: 5,
        paddingLeft: 20,
        borderRadius: 50,
    },
    title_view: {
        width: '80%'
    },
    title_text: {
        color: 'gray',
        fontWeight: '500',
        fontSize: 12
    },
    button: {
        width: '80%',
        height: 50,
        backgroundColor: 'blue',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }


});