<script setup>
import { ref, nextTick } from 'vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

// 数据
const message = ref('')
const messages = ref([])

// function showEmoji() {
//       //打开表情选择器
//       console.log("打开表情选择器")
//     },

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
        <div class="message sent">
          <div class="message-content">
            <div class="message-header">
              <span class="message-username">{{ userStore.user.username }}</span>
              <span class="message-time">10:32</span>
            </div>
            <div class="message-bubble">
              <p>我过得很好，谢谢！你呢？</p>
            </div>
          </div>
          <img :src="userStore.user.avatar" alt="我的头像" class="avatar-right" />
        </div>
        <!-- 对方消息 -->
        <div class="message received">
          <img src="https://api.dicebear.com/7.x/bottts/svg?seed=a4" alt="对方头像" class="avatar-left" />
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
   <!-- 聊天输入区域 -->
    <div class="chat-input">
      <div class="input-actions">
        <!-- 表情按钮 -->
        <button class="emoji-btn" @click="showEmoji">
          <i class="fa fa-smile-o"></i>😊
        </button>
      </div>
      <div class="input-wrapper">
        <input type="text" placeholder="输入消息..." v-model="message" @keyup.enter="sendMessage">
      </div>

      <button class="send-btn" @click="sendMessage">
        <span class="send-content">
          <span class="send.text">发送</span>
        </span>
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 5px;
  object-fit: cover;
}
.avatar-right {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 5px;

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
  padding: 4px 10px;
  border-radius: 12px;
  display: inline-block;
}

.message {
  display: flex;
  margin-bottom: 1px;
  max-width: 80%;
}

.received {
  align-self: flex-start;
}

.sent {
  align-self: flex-end;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 4px;
}

.received .message-header {
  padding-left: 4px;
}

.received .message-username {
  padding-left: 4px;
}

.message-username {
  font-size: 11px;
  color: #666;
  font-weight: 500;
  margin-right: 8px;
}

.sent .message-username {
  text-align: right;
  padding-right: 4px;
}

.sent .message-header {
  justify-content: flex-end;
  padding-right: 4px;
}

.message-bubble {
  padding: 1px 10px;
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
  color: #999;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
  gap: 8px;
}

.input-actions {
  display: flex;
  margin-right: 4px;
}

.input-wrapper {
  flex: 1;
  min-width: 0;
}

.input-wrapper input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
  height: 40px;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  border-color: #007bff;
}

.emoji-btn {
  background: none;
  border: none;
  color: #6c757d;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  font-size: 18px;
  flex-shrink: 0;
}

.emoji-btn:hover {
  background-color: #e9ecef;
}

.send-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0 16px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  justify-content: center;
}

.send-btn:hover {
  background-color: #0069d9;
}

.send-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.send-text {
  font-size: 14px;
  position: relative;
  top: 1px;
}
</style>
