import moment from 'moment';
import createElementFromHTML from './utils';

export default class Chat {
  addChat() {
    const chatEl = createElementFromHTML(
      `<div class="container">
        <div class="chat__header">Чат</div>
        <div class="chat__container">
          <div class="chat__area">
            <ul class="chat__messages-container"></ul>
            <input class="chat__messages-input" placeholder="Type your message here">
          </div>
          <ul class="chat__userlist"></ul>
        </div>
      </div>`,
    );

    this.chatMessagesContainerEl = chatEl.querySelector(
      '.chat__messages-container',
    );
    this.chatMessagesInput = chatEl.querySelector('.chat__messages-input');
    this.chatUserlistEl = chatEl.querySelector('.chat__userlist');

    return { chatEl, chatMessagesInput: this.chatMessagesInput };
  }

  addMessageContainerYourself(message) {
    this.chatMessagesInput.value = '';
    const date = moment(new Date()).format('HH:mm DD.MM.YY');
    const messageContainerEl = createElementFromHTML(
      `<li class="message__container message__container-yourself"> 
        <div class="message__header">You at ${date}</div>
        <div class="message__text">${message.user.text}</div> 
        
      </li>`,
    );
    this.chatMessagesContainerEl.append(messageContainerEl);

    this.scrollToLastMessage();
  }

  addMessageContainerInterlocutor(message) {
    const date = moment(new Date()).format('HH:mm DD.MM.YY');
    const messageContainerEl = createElementFromHTML(
      `<li class="message__container message__container-interlocutor"> 
        <div class="message__header">${message.user.name} at ${date}</div>
        <div class="message__text interlocutor">${message.user.text}</div> 
      </li>`,
    );
    this.chatMessagesContainerEl.append(messageContainerEl);

    this.scrollToLastMessage();
  }

  addChatUsers(users) {
    this.chatUserlistEl.innerHTML = '';
    users.forEach((user) => {
      const chatUserEl = createElementFromHTML(
        `<li class="chat__user">${user.name}</li>`,
      );
      this.chatUserlistEl.append(chatUserEl);
    });
  }

  scrollToLastMessage() {
    const scrollH = this.chatMessagesContainerEl.scrollHeight;
    const clientH = this.chatMessagesContainerEl.clientHeight;
    this.chatMessagesContainerEl.scrollTop = scrollH - clientH;
  }
}
