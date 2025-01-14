import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! Como posso ajudar com seu treino hoje?',
      sender: 'trainer',
      time: '10:00',
    },
    {
      id: 2,
      text: 'Preciso de ajuda com a série de costas',
      sender: 'user',
      time: '10:05',
    },
    {
      id: 3,
      text: 'Claro! Vou te passar algumas recomendações...',
      sender: 'trainer',
      time: '10:06',
    },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: message,
          sender: 'user',
          time: new Date().toLocaleTimeString().slice(0, 5),
        },
      ]);
      setMessage('');
    }
  };

  const MessageBubble = ({ text, sender, time }) => (
    <View
      style={[
        styles.messageBubble,
        sender === 'user' ? styles.userBubble : styles.trainerBubble,
      ]}
    >
      <Text style={styles.messageText}>{text}</Text>
      <Text style={styles.messageTime}>{time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.trainerInfo}>
          <View style={styles.trainerAvatar}>
            <Icon name="user" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.trainerName}>Personal Trainer</Text>
            <Text style={styles.trainerStatus}>Online</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageRow,
              msg.sender === 'user' ? styles.userMessageRow : styles.trainerMessageRow,
            ]}
          >
            <MessageBubble {...msg} />
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={24} color="#35AAFF" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  trainerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#35AAFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trainerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trainerStatus: {
    color: '#35AAFF',
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageRow: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  trainerMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#35AAFF',
    borderBottomRightRadius: 4,
  },
  trainerBubble: {
    backgroundColor: '#333',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  messageTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;

