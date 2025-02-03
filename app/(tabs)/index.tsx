import React from "react"
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from "react-native"
import { collection, getDocs } from "firebase/firestore"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import useStore from "../../store/store"
import { db } from "../../firebase/firebaseConfig"

interface Post {
  id: string
  title: string
  content: string
  likes: number
  comments: { id: string; text: string }[]
}

const HomeScreen = () => {
  const { posts, setPosts, likePost } = useStore()
  const router = useRouter()

  React.useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"))
      const postsData: Post[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "",
        content: doc.data().content || "",
        likes: doc.data().likes || 0,
        comments: doc.data().comments || [],
      }))
      setPosts(postsData)
    }

    fetchPosts()
  }, [setPosts,likePost]) 

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content} numberOfLines={2}>
        {item.content}
      </Text>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => likePost(item.id)}>
          <Ionicons name="heart-outline" size={24} color="#FF6B6B" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/post/${item.id}`)}>
          <Ionicons name="arrow-forward-outline" size={24} color="#4ECDC4" />
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  listContainer: {
    padding: 16,
  },
  postContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2C3E50",
  },
  content: {
    fontSize: 14,
    color: "#34495E",
    marginBottom: 12,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#7F8C8D",
  },
})

export default HomeScreen

