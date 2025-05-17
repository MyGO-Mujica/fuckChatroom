<script>
export default {
  name: 'ChatComponent',
  data() {
    return {
      message: '',
      messages: []
    }
  },
  mounted() {
    // 滚动到底部
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },
  methods: {
    sendMessage() {
      if (this.message.trim() === '') return;

      // 添加自己发送的消息
      const newMessage = {
        text: this.message,
        time: this.formatTime(new Date()),
        type: 'sent'
      };
      this.messages.push(newMessage);

      // 清空输入框
      this.message = '';

      // 滚动到底部
      this.scrollToBottom();

      // 模拟回复
      setTimeout(() => {
        const replyMessage = {
          text: '我收到了你的消息："' + newMessage.text + '"',
          time: this.formatTime(new Date()),
          type: 'received'
        };
        this.messages.push(replyMessage);
        this.scrollToBottom();
      }, 1000);
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      container.scrollTop = container.scrollHeight;
    },
    formatTime(date) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }
}
</script>

<template>
  <div class="chat-container">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="user-info">
        <div>
          <h3 class="user-name">kexie聊天室</h3>
          <p class="user-status">在线人数：</p>
        </div>
      </div>
      <div class="chat-actions">
        <button class="action-btn"><i class="fa fa-phone"></i></button>
        <button class="action-btn"><i class="fa fa-video"></i></button>
        <button class="action-btn"><i class="fa fa-ellipsis-v"></i></button>
      </div>
    </div>

    <!-- 聊天内容区域 -->
    <div class="chat-messages" ref="messagesContainer">

      <!-- 消息列表 -->
      <div class="message-list">
        <!-- 系统消息 -->
        <div class="system-message">
          <span>今天 10:30</span>
        </div>

        <!-- 对方消息 -->
        <div class="message received">
          <img src="" alt="对方头像" class="avatar-left">
          <div class="message-content">
            <div class="message-bubble">
              <p>你好！今天过得怎么样？</p>
            </div>
            <span class="message-time">10:30</span>
          </div>
        </div>

        <!-- 自己消息 -->
        <div class="message sent">
          <div class="message-content">
            <div class="message-bubble">
              <p>我过得很好，谢谢！你呢？</p>
            </div>
            <span class="message-time">10:32</span>
          </div>
          <img src="" alt="我的头像" class="avatar-right">
        </div>

        <!-- 对方消息 -->
        <div class="message received">
          <img src="" alt="对方头像" class="avatar-left">
          <div class="message-content">
            <div class="message-bubble">
              <p>我也很好，最近在学习，感觉还不错。</p>
            </div>
            <span class="message-time">10:35</span>
          </div>
        </div>

        <!-- 自己消息 -->
        <div class="message sent">
          <div class="message-content">
            <div class="message-bubble">
              <p>有什么问题可以一起讨论。</p>
            </div>
            <span class="message-time">10:37</span>
          </div>
          <img src="" alt="我的头像" class="avatar-right">
        </div>
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
        <input type="text" placeholder="输入消息..." v-model="message" @keyup.enter="sendMessage">
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
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar-left {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}
.avatar-right {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
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

.system-message {
  text-align: center;
  margin: 12px 0;
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
