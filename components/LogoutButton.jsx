import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../constants/colors'
import styles from '../assets/styles/profile.style'
import { useAuthStore } from '../store/authStore'

const LogoutButton = () => {
    const { logoutUser,user } = useAuthStore();
    const confirmLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => handleLogout()
                }
            ]
        )
    }
    const handleLogout = () => {
        logoutUser();
    }

    if(!user) return null
    return (
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <Ionicons
                name="log-out-outline"
                size={20}
                color={COLORS.white}
            />
            <Text style={styles.logoutText}>
                Logout
            </Text>
        </TouchableOpacity>
    )
}

export default LogoutButton