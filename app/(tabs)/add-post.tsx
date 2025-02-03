import { useState } from "react";
import { TextInput, Button, View } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import useStore from "../../store/store";
import { useRouter } from "expo-router";

const AddPostScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { addPost } = useStore();
  const router = useRouter();

  const handleAddPost = async () => {
    const newPost = {
      title,
      content,
      likes: 0,
      comments: [],
    };

    const docRef = await addDoc(collection(db, "posts"), newPost);

    addPost({ id: docRef.id, ...newPost });
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput placeholder="Content" value={content} onChangeText={setContent} />
      <Button title="Add Post" onPress={handleAddPost} />
    </View>
  );
};

export default AddPostScreen;
