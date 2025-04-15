import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import styles from '../../assets/styles/create.style';
import { Ionicons } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore'

const Create = () => {
  const reviewLabels = ['Terrible', 'Bad', 'OK', 'Good', 'Great'];

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [rating, setRating] = useState(1);
  const [image, setImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();
  const { token } = useAuthStore()

  const pickImage = async () => {
    try {
      // request permission if needed
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need camera roll permissions to make this work!");
          return;
        }
      }

      // if permission access
      // launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        // if base 64 provided
        if (result.assets[0].base64) {
          setPreviewImg(result.assets[0].base64);
        }
        else {
          // other convert to base 64
          const convertImageToBase64 = await FileSystem.readAsStringAsync(result.assets[0].url, {
            encoding: FileSystem.EncodingType.Base64,
          });

          setPreviewImg(convertImageToBase64)
        }
      }
    } catch (error) {
      console.log(error);

    }
  }

  const handlePost = async () => {
    if (!title || !shortDescription || !image || !previewImg) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    setLoading(true);

    try {
      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : 'image/jpeg';

      const imageDataUrl = `data:${imageType};base64,${previewImg}`;

      const response = await fetch('http://localhost:4000/api/v1/books/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          shortDescription,
          img: imageDataUrl,
          rating,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      Alert.alert("Success", "Post created successfully!");
      setTitle("");
      setShortDescription("");
      setImage(null);
      setPreviewImg(null);
      setRating(1)
      router.replace('/');

    } catch (error) {
      console.log("Error in creating Post:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}  // Changed this
        style={styles.scrollViewStyle}  // Added this
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}

      >
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Post</Text>
              <Text style={styles.subtitle}>Share your thoughts with the world</Text>
            </View>

            <View style={styles.form}>
              {/* Title */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title:</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="pencil-outline" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input} placeholder="Enter title"
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                  />
                </View>
              </View>

              {/* Rating */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Your Rating</Text>
                <View style={styles.ratingContainer}>
                  <Rating
                    type="star"
                    ratingCount={5}
                    imageSize={30}
                    startingValue={rating}
                    onFinishRating={setRating}
                    tintColor="#f0f8ff"
                    ratingColor="#1976D2"
                  />
                  <Text style={{ marginTop: 10, color: '#1976D2', fontWeight: 'bold' }}>
                    {reviewLabels[rating - 1]}
                  </Text>
                </View>
              </View>

              {/* Book Image */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Book Image:</Text>
                <TouchableOpacity
                  style={styles.imagePicker}
                  onPress={pickImage}
                >
                  {
                    image ? (
                      <Image source={{ uri: image }} style={styles.previewImage} />
                    ) : (
                      <View style={styles.placeholderContainer}>
                        <Ionicons name="image-outline" size={20} style={styles.placeholderText} />
                        <Text style={styles.placeholderText}>Select Image</Text>
                      </View>
                    )
                  }
                </TouchableOpacity>
              </View>

              {/* Caption */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Caption:</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter caption"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={200}
                  value={shortDescription}
                  onChangeText={setShortDescription}
                />
              </View>

              {/* Submit */}
              <View style={styles.formGroup}>
                <TouchableOpacity
                  disabled={isLoading}
                  style={styles.button}
                  onPress={handlePost}
                >
                  {
                    isLoading ? (
                      <ActivityIndicator color='#fff' />
                    ) : (
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                        
                      }}>
                        <Ionicons name="share-social-outline" size={20} style={[styles.buttonIcon, { marginRight: 5 }]} />
                        <Text style={styles.buttonText}>Share</Text>
                      </View>
                    )
                  }


                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Create;