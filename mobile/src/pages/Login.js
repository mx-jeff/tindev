import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { Platform, KeyboardAvoidingView, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'

import logo from '../assets/logo.png'

import api from '../services/api'

export default function Login({ navigation }){

    const [user, setUser] = useState('')

    useEffect(() =>{
        AsyncStorage.getItem('user').then(user =>{
            if(user){
                navigation.navigate('Main', { user })
            }

        })
        
    }, [])

    async function handleLogin(){
        console.log(user)
        const response = await api.post('/devs', { username: user })

        const { _id } = response.data
        
        await AsyncStorage.setItem('user', _id)

        navigation.navigate('Main', { user: _id })
    }

    return( 
        <KeyboardAvoidingView 
            behavior="padding"
            enabled={Platform.OS == 'ios'}
            style={styles.container}
        >

            <Image source={logo} />

            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                placeholderTextColor="#999" 
                placeholder="Usuario do github"
                value={user}
                onChangeText={setUser}

            />

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    }, 

    input: {
        height: 46,
        alignSelf: "stretch",
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingTop: 10,
        paddingHorizontal: 15
    },

    button: {
        height: 46,
        alignSelf: "stretch",
        backgroundColor: "#DF4723",
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        
    }
})