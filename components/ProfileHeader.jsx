import { View, Text } from 'react-native'
import React from 'react'
import styles from '../assets/styles/profile.style'
import { Image } from 'expo-image'
import { useAuthStore } from '../store/authStore'
import COLORS from '../constants/colors'

const ProfileHeader = () => {
  const { user } = useAuthStore();

  return (
    <View style={styles.profileHeader}>
      <Image
        source={{ uri: user?.avatar }}  
        style={[styles.profileImage , {backgroundColor:COLORS.border,overflow:"hidden"}]}
        contentFit='cover'
      />



      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.memberSince}>📅 Member since:{" "}
          {
            new Date(user?.createdAt).toDateString().split(" ").slice(1).join(" ")
          }
        </Text>
      </View>
    </View>
  )
}

export default ProfileHeader