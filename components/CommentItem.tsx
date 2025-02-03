import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface CommentItemProps {
  text: string
}

const CommentItem: React.FC<CommentItemProps> = ({ text }) => {
  return (
    <View style={styles.commentContainer}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle-outline" size={24} color="#4ECDC4" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.commentText}>{text}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  commentText: {
    fontSize: 14,
    color: "#34495E",
    lineHeight: 20,
  },
})

export default CommentItem

