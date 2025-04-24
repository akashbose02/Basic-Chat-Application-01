// App.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Button,
  FlatList,
  Text,
  View,
} from "react-native";
import { io } from "socket.io-client";

const socket = io("http://192.168.1.40:3000");

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    const msg = { text: message };
    socket.emit("send_message", msg);
    setMessage("");
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title="Send" onPress={sendMessage} />
    </SafeAreaView>
  );
}
