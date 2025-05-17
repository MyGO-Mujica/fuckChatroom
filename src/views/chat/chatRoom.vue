<script setup>
import { ref, nextTick } from 'vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

// 数据
const message = ref('')
const messages = ref([])

// 发送消息
// sendMessage 函数定义
function sendMessage() {
  if (message.value.trim() === '') return
  const newMessage = {
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
        <!-- 动态渲染消息 -->
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
          <img
            v-if="msg.type === 'received'"
            src="https://api.dicebear.com/7.x/bottts/svg?seed=a2"
            alt="对方头像"
            class="avatar-left"
          />
          <div class="message-content">
            <div class="message-bubble">
              <p>{{ msg.text }}</p>
            </div>
            <span class="message-time">{{ msg.time }}</span>
          </div>
          <img
            v-if="msg.type === 'sent'"
            :src="userStore.user.avatar"
            alt="我的头像"
            class="avatar-right"
          />
        </div>
        <!-- 自己消息 -->
        <!-- <div class="message sent">
          <div class="message-content">
            <div class="message-bubble">
              <p>有什么问题可以一起讨论。</p>
            </div>
            <span class="message-time">10:37</span>
          </div>
          <img :src="userStore.user.avatar" alt="我的头像" class="avatar-right" />
        </div> -->
      </div>
    </div>

    <!-- 聊天输入区域 -->
    <div class="chat-input">
      <div class="input-actions">
        <button class="action-btn"><i class="fa fa-smile-o"></i></button>
        <button class="action-btn"><i class="fa fa-paperclip"></i></button>
        <button class="action-btn"><i class="fa fa-microphone"></i></button>
      </div>
      <div class="input-wrapper">
        <input type="text" placeholder="输入消息..." v-model="message" @keyup.enter="sendMessage" />
      </div>
      <button class="send-btn" @click="sendMessage">
        <i class="fa fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(134, 35, 35, 0.1);
  background-color: #fff;
}

.chat-header {
  display: flex;
  justify-content: space-between; /* 两端对齐，确保 chat-actions 在右侧 */
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1; /* 占据剩余空间 */
}

.avatar-left {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}
.avatar-right {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-left: 12px;
  object-fit: cover;
}

.user-name {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', system-ui, sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #112fd8;
  margin: 0;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.user-status {
  font-size: 12px;
  color: #6c757d;
  margin: 0;
}

.chat-actions {
  display: flex;
}

.action-btn {
  background: none;
  border: none;
  color: #6c757d;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-left: 8px;
}

.action-btn:hover {
  background-color: #e9ecef;
  color: #333;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.message-list {
  display: flex;
  flex-direction: column;
}

.system-message span {
  background-color: #e9ecef;
  color: #6c757d;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
}

.message {
  display: flex;
  margin-bottom: 16px;
  max-width: 80%;
  clear: both;
}

.received {
  align-self: flex-start;
}

.sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-bubble {
  padding: 10px 16px;
  border-radius: 18px;
  margin-bottom: 4px;
  position: relative;
  font-size: 14px;
  line-height: 1.4;
}

.received .message-bubble {
  background-color: #e9ecef;
  color: #333;
  border-top-left-radius: 4px;
}

.sent .message-bubble {
  background-color: #007bff;
  color: #fff;
  border-top-right-radius: 4px;
}

.message-time {
  font-size: 10px;
  color: #6c757d;
  text-align: right;
  margin: 0 8px;
}

.message-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e9ecef;
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

.input-actions {
  display: flex;
  margin-right: 12px;
}

.input-wrapper {
  flex: 1;
  position: relative;
  margin-right: 12px;
}

.input-wrapper input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e9ecef;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.input-wrapper input:focus {
  border-color: #007bff;
}

.send-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-btn:hover {
  background-color: #0069d9;
  transform: scale(1.05);
}
</style>
