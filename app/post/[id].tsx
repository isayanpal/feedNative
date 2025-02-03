import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; 
import useStore from "../../store/store"; 
import CommentItem from "../../components/CommentItem"; 

interface Comment {
  id: string;
  text: string;
}

const PostDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts, addComment } = useStore();
  const [commentText, setCommentText] = useState("");

  const post = posts.find((p) => p.id === id);

  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;

      const snapshot = await getDocs(collection(db, `posts/${id}/comments`));
      const comments: Comment[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
      }));

      addComment(id, comments); // Replacing existing comments instead of appending
    };

    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!post || commentText.trim() === "") return;

    const docRef = await addDoc(collection(db, `posts/${id}/comments`), {
      text: commentText,
    });

    const newComment: Comment = { id: docRef.id, text: commentText };
    addComment(post.id, [newComment]); // store will prevent duplicates
    setCommentText("");
  };

  return (
    <View style={{ padding: 20 }}>
      {post ? (
        <>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>{post.title}</Text>
          <Text>{post.content}</Text>

          <FlatList
            data={post.comments || []}
            keyExtractor={(item) => item.id} // This will now always be unique
            renderItem={({ item }) => <CommentItem text={item.text} />}
          />

          <TextInput
            placeholder="Write a comment..."
            value={commentText}
            onChangeText={setCommentText}
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
          />
          <Button title="Comment" onPress={handleAddComment} />
        </>
      ) : (
        <Text>Post not found</Text>
      )}
    </View>
  );
};

export default PostDetailsScreen;
