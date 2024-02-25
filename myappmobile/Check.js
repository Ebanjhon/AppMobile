import { View, Button } from "react-native"
import React, { useState } from 'react';
import axios, { Axios } from "axios";

const Check = () => {

    const [username, setUsername] = useState('cac123');
    const [password, setPassword] = useState('1234567890');
    const [email, setEmail] = useState('123123@ou.edu.vn');

    const handlePress = async (e) => {
        console.log('Button pressed!');
        try {
            const response = await fetch('https://nmau4669.pythonanywhere.com/User/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            // Registration successful, you may redirect the user or show a success message
            console.log('Registration successful');
        } catch (error) {
            console.error(error)
        }
    };
    return (
        <View style={{ marginTop: 200 }}>
            <Button title="Press Me" onPress={handlePress} />
        </View>
    )
}

export default Check