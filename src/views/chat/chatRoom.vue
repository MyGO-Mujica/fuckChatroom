<script setup>
import { ref, nextTick } from 'vue'
import 'emoji-picker-element'
import { useUserStore } from '@/stores'
import './chatRoom.css'
const userStore = useUserStore()

// 数据
const message = ref('')
const messages = ref([])
const showEmoji = ref(false)
// function showEmoji() {
//       //打开表情选择器
//       console.log("打开表情选择器")
//     },

// 发送消息
// sendMessage 函数定义
function sendMessage() {
  if (message.value.trim() === '') return
  const newMessage = {
    username: userStore.user.username,
    text: message.value,
    time: formatTime(new Date()),
    type: 'sent',
  }
  messages.value.push(newMessage)
  message.value = ''
  scrollToBottom()
  setTimeout(() => {
    const replyMessage = {
      text: `我收到了你的消息："${newMessage.text}"`,
      time: formatTime(new Date()),
      type: 'received',
    }
    messages.value.push(replyMessage)
    scrollToBottom()
  }, 1000)
}
// 增添emoji
function handleEmojiClick(event) {
  const emoji = event.detail.unicode
  message.value += emoji
  showEmoji.value = false
}
// 滚动到底部
const messagesContainer = ref(null)
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 格式化时间
function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 初始化时滚动到底部并打印 avatar 路径
nextTick(() => {
  scrollToBottom()
  console.log(userStore)
})
</script>

<template>
  <div class="chat-container">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="user-info">
        <div>
          <h3 class="user-name">Kexie聊天室</h3>
        </div>
      </div>
    </div>

    <!-- 聊天内容区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <!-- 消息列表 -->
      <div class="message-list">
        <!-- 动态渲染消息 -->
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
          <img
            v-if="msg.type === 'received'"
            src="https://api.dicebear.com/7.x/bottts/svg?seed=a2"
            alt="对方头像"
            class="avatar-left"
          />
          <div class="message-content">
            <div class="message-header">
              <span class="message-username">{{ msg.username }}</span>
              <span class="message-time">{{ msg.time }}</span>
            </div>

            <div class="message-bubble">
              <p>{{ msg.text }}</p>
            </div>
          </div>
          <img
            v-if="msg.type === 'sent'"
            :src="userStore.user.avatar"
            alt="我的头像"
            class="avatar-right"
          />
        </div>

        <!-- 自己消息 -->
        <div class="message sent">
          <div class="message-content">
            <div class="message-header">
              <span class="message-username">{{ userStore.user.username }}</span>
              <span class="message-time">10:32</span>
            </div>
            <div class="message-bubble">
              <p>我</p>
            </div>
          </div>
          <img :src="userStore.user.avatar" alt="我的头像" class="avatar-right" />
        </div>
        <!-- 对方消息 -->
        <div class="message received">
          <img
            src="https://api.dicebear.com/7.x/bottts/svg?seed=a4"
            alt="对方头像"
            class="avatar-left"
          />
          <div class="message-content">
            <div class="message-header">
              <span class="message-username">对方用户名</span>
              <span class="message-time">10:35</span>
            </div>
            <div class="message-bubble">
              <p>我也很好，最近在学习，感觉还不错。</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天输入区域 -->
    <div class="chat-input">
      <div class="input-actions">
        <!-- 表情按钮 -->
        <button class="emoji-btn" @click="showEmoji = !showEmoji">😊</button>
        <div v-if="showEmoji" class="emoji-picker-container">
          <emoji-picker @emoji-click="handleEmojiClick"></emoji-picker>
        </div>
      </div>
      <div class="input-wrapper">
        <input type="text" placeholder="输入消息..." v-model="message" @keyup.enter="sendMessage" />
      </div>

      <button class="send-btn" @click="sendMessage">
        <span class="send-content">
          <span class="send.text">发送</span>
        </span>
      </button>
    </div>
  </div>
</template>

