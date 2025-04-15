import { View, Text } from 'react-native'
import React from 'react'
import styles from '../assets/styles/home.style'
import COLORS from '../constants/colors'
import { Image } from 'expo-image'
import { Rating } from 'react-native-ratings'

const BookCard = ({ book }) => {

    return (
        <View style={styles.bookCard}>
            <View style={styles.bookHeader}>
                <View style={styles.userInfo}>
                    <Image
                        style={[styles.avatar]}
                        source={{ uri: book?.userId?.avatar }}
                    />

                    <Text style={styles.username}>
                        {book?.userId.name}
                    </Text>
                </View>
            </View>
            <View style={styles.bookImageContainer}>
                <Image
                    style={[styles.bookImage]}
                    source={{ uri: book?.img?.url }}
                />

            </View>
            <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>
                    {book?.title}
                </Text>
                <View style={styles.ratingContainer}>
                    <Rating
                        type="star"
                        ratingCount={5}
                        startingValue={book?.rating}
                        imageSize={20}
                        tintColor="#f0f8ff"
                        ratingColor="#1976D2"
                        readonly={true}
                        fractions={1}
                        ratingBackgroundColor={COLORS.lightGray}

                    />
                </View>
                <Text numberOfLines={2} style={styles.caption}>
                    {book?.shortDescription}
                </Text>
                <Text style={styles.date}>
                    Posted:{" "} {new Date(book?.createdAt).toDateString().split(" ").splice(1).join(" ")}
                </Text>
            </View>

        </View>
    )
}

export default BookCard