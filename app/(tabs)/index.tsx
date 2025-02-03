import { useEffect } from "react";
import { FlatList, Text, View, Button } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";
import useStore from "../../store/store";
import { db } from "../../firebase/firebaseConfig";

interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
  comments: { id: string; text: string }[];
}

const HomeScreen = () => {
  const { posts, setPosts, likePost } = useStore();
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"));
      const postsData: Post[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "",
        content: doc.data().content || "",
        likes: doc.data().likes || 0,
        comments: doc.data().comments || [], 
      }));
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 20, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18 }}>{item.title}</Text>
          <Text>{item.content}</Text>
          <Text>Likes: {item.likes || 0}</Text>
          <Button title="Like" onPress={() => likePost(item.id)} />
          <Button
            title="View"
            onPress={() => {
              console.log("Navigating to:", `post/${item.id}`);
              router.push(`/post/${item.id}`)}}
          />
        </View>
      )}
    />
  );
};

export default HomeScreen;
