import { View, Text, KeyboardAvoidingView, Platform, FlatList,ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../../assets/styles/home.style'
import BookCard from '../../components/BookCard'
import { useAuthStore } from '../../store/authStore'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'

const sleep = (ms) => new Promise((resolve)=>setTimeout(resolve,ms))

const Home = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [books, setBooks] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { token } = useAuthStore()

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true)
      else if (pageNum === 1) setIsLoading(true)

      const response = await fetch(`http://localhost:4000/api/v1/books/?page=${pageNum}&limit=${5}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch data !!")
      }

      const uniqueBooks = refresh || pageNum === 1
        ? data.books
        : Array.from(new Set([...books, ...data.books].map((book) => book._id)))
            .map((id) => [...books, ...data.books].find((book) => book._id === id))

      setBooks(uniqueBooks)
      setHasMore(data.books.length > 0)
      setPage(pageNum)
    } catch (error) {
      console.log("Error fetchBooks:", error)
    } finally {
      if (refresh) {
        await sleep(1000)
        setRefreshing(false);
      }
      else setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleLoadMore = async () => {
    if (hasMore && !refreshing && !isLoading) {
      await sleep(800)
      await fetchBooks(page + 1)
    }
  }

  const handleRefresh = () => {
    fetchBooks(1, true)
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to Bookify 🍭</Text>
          <Text style={styles.headerSubtitle}>Your personal book library</Text>
        </View>

        {/* Book List */}
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={books}
          refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>fetchBooks(1,true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            />
          }
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <BookCard book={item} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name='book-outline'
                size={60}
                color={COLORS.textSecondary}
              />
              <Text style={styles.emptyText}>No recommendations yet</Text>
              <Text style={styles.emptySubtext}>Be the first to share a book!</Text>
            </View>
          }

          ListFooterComponent={
            hasMore && books?.length > 0 ? (
              <ActivityIndicator
              style={styles.footerLoader}
              size={"small"}
              color={COLORS.textSecondary}
              />
            ): null
          }
        />
      </View>
    </KeyboardAvoidingView>
  )
}

export default Home
