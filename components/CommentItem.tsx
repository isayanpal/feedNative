import { View, Text, StyleSheet } from "react-native";

interface CommentItemProps {
  text: string;
}

const CommentItem = ({ text }: CommentItemProps) => (
  <View style={styles.commentContainer}>
    <Text>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});

export default CommentItem;
