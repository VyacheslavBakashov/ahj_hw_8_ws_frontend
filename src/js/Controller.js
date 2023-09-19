/* eslint-disable no-return-await */
/* eslint-disable no-unused-expressions */
import Request from './Request';
import Chat from './Chat';
import Modal from './Modal';

export default class Controller {
  constructor(port) {
    this.container = null;
    this.api = new Request(port);
    this.websocket = null;
  }

  init() {
    const modal = new Modal();
    const { modalOk, formInput, onClose } = modal.addModal();

    modalOk.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!formInput.value) {
        await modal.addFormHint('The field cannot be empty!');
      }

      const res = await this.api.postNewUser({ name: formInput.value });
      if (res) {
        return await modal.addFormHint(res.message);
      }

      this.userName = formInput.value;
      this.registerEvents(formInput.value);
      onClose();

      this.chat = new Chat();
      const { chatEl, chatMessagesInput } = this.chat.addChat();

      this.container.append(chatEl);

      chatMessagesInput.addEventListener('keydown', (ev) => {
        if (ev.keyCode !== 13 || !ev.target.value) {
          return;
        }

        const payload = JSON.stringify({
          type: 'send',
          user: {
            name: this.userName,
            text: ev.target.value,
          },
        });
        this.websocket.send(payload);
      });
      return '';
    });

    window.onbeforeunload = () => {
      const payload = JSON.stringify({
        type: 'exit',
        user: { name: this.userName },
      });
      this.websocket && this.websocket.send(payload);
    };
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  registerEvents(payload) {
    this.websocket = new WebSocket(this.api.wsURL);

    this.websocket.addEventListener('open', () => {
      this.websocket.send(
        JSON.stringify({
          type: 'connection',
          user: { name: payload },
        }),
      );
    });

    this.websocket.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      const isSend = Object.prototype.hasOwnProperty.call(data, 'type');
      if (isSend) {
        return data.user.name === this.userName
          ? this.chat.addMessageContainerYourself(data)
          : this.chat.addMessageContainerInterlocutor(data);
      }

      const activeUsers = data.map((user) => {
        if (user.name === this.userName) {
          user.name = 'You';
        }

        return user;
      });

      this.chat.addChatUsers(activeUsers);
      return '';
    });
  }
}
