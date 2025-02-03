import { useState } from "react"
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"
import useStore from "../../store/store"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

const AddPostScreen = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const { addPost } = useStore()
  const router = useRouter()

  const handleAddPost = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in both title and content")
      return
    }

    const newPost = {
      title,
      content,
      likes: 0,
      comments: [],
    }

    try {
      const docRef = await addDoc(collection(db, "posts"), newPost)
      addPost({ id: docRef.id, ...newPost })
      setTitle("") 
      setContent("") 
      Alert.alert("Success", "Post added successfully", [{ text: "OK", onPress: () => router.back() }])
    } catch (error) {
      Alert.alert("Error", "Failed to add post. Please try again.")
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} placeholder="Enter title" value={title} onChangeText={setTitle} />
        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Enter content"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleAddPost}>
          <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Add Post</Text>
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
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  contentInput: {
    height: 150,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4ECDC4",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
})

export default AddPostScreen
