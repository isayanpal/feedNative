import { create } from "zustand";

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
  removePost: (postId: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comments: Comment[]) => void;
}

const useStore = create<StoreState>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  removePost: (postId) =>
    set((state) => ({ posts: state.posts.filter((p) => p.id !== postId) })),
  likePost: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ),
    })),
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
