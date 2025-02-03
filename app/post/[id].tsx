import React,{ useState, useEffect } from "react"
import { useLocalSearchParams } from "expo-router"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"
import useStore from "../../store/store"
import CommentItem from "../../components/CommentItem"
import { Ionicons } from "@expo/vector-icons"

interface Comment {
  id: string
  text: string
}

const PostDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { posts, addComment } = useStore()
  const [commentText, setCommentText] = useState("")

  const post = posts.find((p) => p.id === id)

  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return

      try {
        const snapshot = await getDocs(collection(db, `posts/${id}/comments`))
        const comments: Comment[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
        }))

        addComment(id, comments)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch comments. Please try again.")
      }
    }

    fetchComments()
  }, [id, addComment])

  const handleAddComment = async () => {
    if (!post || commentText.trim() === "") return

    try {
      const docRef = await addDoc(collection(db, `posts/${id}/comments`), {
        text: commentText,
      })

      const newComment: Comment = { id: docRef.id, text: commentText }
      addComment(post.id, [newComment])
      setCommentText("")
    } catch (error) {
      Alert.alert("Error", "Failed to add comment. Please try again.")
    }
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.content}>{post.content}</Text>
            <Text style={styles.commentsHeader}>Comments</Text>
          </>
        }
        data={post.comments || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CommentItem text={item.text} />}
        ListEmptyComponent={<Text style={styles.noComments}>No comments yet</Text>}
        contentContainerStyle={styles.commentsList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Write a comment..."
          value={commentText}
          onChangeText={setCommentText}
          style={styles.input}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleAddComment}>
          <Ionicons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
    padding: 16,
  },
  content: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  commentsList: {
    paddingBottom: 80,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4ECDC4",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#FF6B6B",
    textAlign: "center",
    marginTop: 20,
  },
  noComments: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    marginTop: 20,
  },
})

export default PostDetailsScreen

