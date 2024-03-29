import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import io from 'socket.io-client'

import api from '../services/api.js'

import logo from '../assets/logo.png'
import like from '../assets/like.png'
import dislike from '../assets/dislike.png'


export default function Main({ navigation }) {

    const id = navigation.getParam('user')
    const [users, setUsers] = useState([])
    const [matchDev, setMatchDev] = useState(null)

    useEffect( () => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id
                }
            })

            setUsers(response.data)
        }

        loadUsers()
    }, [id])

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: id }
        })

        socket.on('match', dev => {
            setMatchDev(dev)
        })
    }, [id])


    async function handleLike() {
        const [ user, ...rest] = users

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: {
                user: id
            }
        })

        setUsers(rest)
    }

    async function handleDislike() {
        const [ user, ...rest] = users

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: {
                user: id
            }
        })

        setUsers(rest)
    }

    async function handleLogout() {
        await AsyncStorage.clear()

        navigation.navigate('Login')
    }

    return (
        <SafeAreaView style={visual.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={visual.logo} source={logo} />
            </TouchableOpacity>

            <View style={visual.cardsContainer}>
                { users.length === 0 ?
                    <Text style={visual.empty}>Acabou :(</Text> : 
                    (
                        users.map((user, index) => (
                            <View key={user._id} style={[visual.card, { zIndex: users.length - index}]}>
                                <Image style={visual.avatar} source={{ uri: user.avatar }} />
                                <View style={visual.footer}>
                                    <Text style={visual.name}>{user.name}</Text>
                                    <Text style={visual.bio} numberOfLines={3}> {user.bio} </Text>
                                </View>
                            </View>
                        ))
                    ) 
                }
            </View>

            { users.length > 0 && (
                <View style={visual.buttonsContainer}>

                    <TouchableOpacity style={visual.button} onPress={handleLike}>
                        <Image source={like}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={visual.button} onPress={handleDislike}>
                        <Image source={dislike}/>
                    </TouchableOpacity>

                </View>
            )}

            { matchDev && (
                <View style={visual.matchContainer}>
                    <Text style={visual.matchTitle}>It's Match</Text>
                    <Image style={visual.matchAvatar} source={{ uri: matchDev.avatar}}/>

                    <Text style={visual.matchName}>{matchDev.name}</Text>
                    <Text style={visual.matchBio}>{matchDev.bio}</Text>

                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={visual.closeMatch}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            )}  
        </SafeAreaView>
    )
}

const visual =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    logo:{
        marginTop: 30,
    },

    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold'
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },

    card:{
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0, 
        left: 0,
        right: 0,
        bottom: 0,        
    },

    avatar: {
        flex: 1,
        height: 300,
    },

    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 20,
    },

    buttonsContainer: {
        zIndex: -1, // Not Best Solution, allow to buttons dont show above match container
        flexDirection: 'row',
        marginBottom: 30,
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        }
    },

    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // Not Best Solution, allow to match container becomes above all
    },

    matchTitle: {
        fontSize: 40,
        color: "#FFF",
        fontFamily: 'Roboto',
        marginBottom: 10
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        marginVertical: 30,
    },

    matchImage: {
        height: 60,
        resizeMode: 'contain',
    },

    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
    },

    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        textAlign: "center",
        paddingHorizontal: 30,
    },

    closeMatch: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: "center",
        marginTop: 10,
        fontWeight: 'bold',
    }
})