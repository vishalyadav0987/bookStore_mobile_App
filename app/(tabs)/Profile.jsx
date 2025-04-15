// profile.js

import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import styles from '../../assets/styles/profile.style';
import ProfileHeader from '../../components/ProfileHeader';
import PostContainer from '../../components/PostContainer';
import LogoutButton from '../../components/LogoutButton';

const profile = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ProfileHeader />
        <LogoutButton />
        <PostContainer /> 
      </View>
    </KeyboardAvoidingView>
  );
};

export default profile;
