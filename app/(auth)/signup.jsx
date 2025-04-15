import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import styles from '../../assets/styles/signup.style';
import COLORS from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

const signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const {user,isLoading,register,token} = useAuthStore()
  const handleRegister = async () => { 
    const response = await register(name,email,password);
    // console.log(name,email,password);
    
    if(!response.success){
      Alert.alert("Error", response.error);
    }
    
  }
  if(user && token){
    console.log("User data:", user);
  console.log("User data:", token);
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Form Container */}
          <View style={styles.formContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Sign Up</Text>
              <Text style={styles.subtitle}>Create an account to get started</Text>
            </View>
            {/* Name  */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fullname</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder='Enter your name'
                  placeholderTextColor={COLORS.placeholderText}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
            {/* Email  */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder='Enter your email'
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
              </View>
            </View>
            {/* Password  */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder='Enter your password'
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize='none'
                  autoCorrect={false}
                  keyboardType='default'
                />
                {
                  !showPassword
                    ? <Ionicons
                      name="eye-off-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                    : <Ionicons
                      name="eye-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                }
              </View>
            </View>
            {/* Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              style={styles.button}>
              {
                isLoading ? (
                  <ActivityIndicator color='#fff' />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )
              }
            </TouchableOpacity>
            {/* Card Footer  */}
            <View style={styles.footer}>
              <Text style={styles.footerText}> 
                you already have an account?
                 </Text>
              <TouchableOpacity>
                <Link href={'/'} style={styles.link}>Sign in</Link>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default signup
