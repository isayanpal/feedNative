import { create } from "zustand";
import { db } from "../firebase/firebaseConfig"; 
import { doc, updateDoc } from "firebase/firestore";

interface Comment {
  id: string;
  text: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
  comments: Comment[];
}

interface StoreState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  // removePost: (postId: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comments: Comment[]) => void;
}

const useStore = create<StoreState>((set, get) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  // removePost: (postId) =>
  //   set((state) => ({ posts: state.posts.filter((p) => p.id !== postId) })),
  likePost: async (postId: string) => {
    const state = get(); // Getting the current state
  
    // Finding the post
    const updatedPost = state.posts.find((p) => p.id === postId);
  
    // If the post exists, updating Firestore
    if (updatedPost) {
      try {
        const postDocRef = doc(db, "posts", postId);
  
        // Update Firestore first
        await updateDoc(postDocRef, {
          likes: updatedPost.likes + 1, // Incrementing likes directly in Firestore
        });
  
        // Then updating the local state to reflect the increment
        set({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, likes: p.likes + 1 } : p
          ),
        });
      } catch (error) {
        console.error("Error updating likes in Firestore:", error);
      }
    }
  },
  
  addComment: (postId, newComments) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments.filter(
                  (c) => !newComments.some((nc) => nc.id === c.id)
                ), // to prevent duplicate comments
                ...newComments,
              ],
            }
          : p
      ),
    })),
}));

export default useStore;
