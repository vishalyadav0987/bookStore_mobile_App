// Login Pages why i am giving index.jsx because i am using expo router and i want to use this as my default page for login
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import styles from '../../assets/styles/login.style'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { Link } from 'expo-router'
import { useAuthStore } from '../../store/authStore'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const { isLoading, loginUser } = useAuthStore()

    const handleLogin = async () => {
        const res = await loginUser(email, password);
        if (!res.success) {
            Alert.alert("Error", res.error)
            
        }
        // console.log("respnse",res);
    }
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.container}>
                {/* Illustration */}
                <View style={styles.topIllustration}>
                    <Image
                        style={styles.illustrationImage}
                        source={require('../../assets/images/react-logo.png')}
                        contentFit='contain'
                    />
                </View>
                {/* Form */}
                <View style={styles.card}>
                    <View style={styles.formContainer}>
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
                            onPress={handleLogin}
                            disabled={isLoading}
                            style={styles.button}>
                            {
                                isLoading ? (
                                    <ActivityIndicator color='#fff' />
                                ) : (
                                    <Text style={styles.buttonText}>Login</Text>
                                )
                            }
                        </TouchableOpacity>
                        {/* Card Footer  */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity>
                                <Link href={'/signup'} style={styles.link}>Sign Up</Link>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Login