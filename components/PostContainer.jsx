import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from '../assets/styles/profile.style';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Rating } from 'react-native-ratings';
import COLORS from '../constants/colors';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'expo-router';

const sleep = (ms) => new Promise((resolve)=>setTimeout(resolve,ms))

const PostContainer = () => {
    const router = useRouter();
    const { token, user } = useAuthStore();

    const [isLoading,setIsLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore,setHasMore] = useState(true);
    const [posts, setPosts] = useState([]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setRefreshing(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const res = await fetch(`http://localhost:4000/api/v1/books/user/${user?._id}`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to fetch data');
            }
            setPosts(data.books);
        } catch (error) {
            console.log("Error fetching posts:", error);
        } finally {
            setRefreshing(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user])

    const deletePost = async (postId) => {
        try {
            const res = await fetch(`http://localhost:4000/api/v1/books/${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                throw new Error(data.message || 'Failed to delete post');
            }
    
            // Remove post from state
            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            console.log("Error deleting post:", error.message);
        }
    };
    

    const renderPostItem = ({ item }) => (
        <View style={styles.bookItem}>
            <Image
                source={{ uri: item?.img?.url }}
                style={styles.bookImage}
                contentFit="cover"
                transition={1000}
            />
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item?.title}</Text>
                <View style={styles.ratingContainer}>
                    <Rating
                        type="star"
                        ratingCount={5}
                        startingValue={item?.rating}
                        imageSize={20}
                        tintColor="#f0f8ff"
                        ratingColor="#1976D2"
                        readonly
                        fractions={1}
                        ratingBackgroundColor={COLORS.lightGray}
                        ratingImage={require('../assets/images/star.png')}
                    />
                </View>
                <Text style={styles.bookCaption} numberOfLines={2}>{item?.shortDescription}</Text>
                <Text style={styles.bookDate}>
                    Posted: {new Date(item?.createdAt).toLocaleDateString()}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deletePost(item._id)}
            >
                <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

    const handleLoadMore = async () => {
        if (hasMore && !refreshing && !isLoading) {
          await sleep(800)
          await fetchData();
        }
      }

      if(isLoading){
        return(
          <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:COLORS.background
          }}
          >
            <ActivityIndicator
            size={"large"}
            color={COLORS.primary}
            />
          </View>
        )
      }

    return (
        <View style={styles.container}>
            <View style={styles.booksHeader}>
                <Text style={styles.bookTitle}>Your Recommendations Posts</Text>
                <Text style={styles.booksCount}>{posts?.length} Posts</Text>
            </View>

            <FlatList
                data={posts}
                renderItem={renderPostItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.booksList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchData}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No recommendations yet</Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push('/Create')}
                        >
                            <Text style={styles.addButtonText}>Add your first post</Text>
                        </TouchableOpacity>
                    </View>
                }
                
            />
        </View>
    );
};

export default PostContainer;
