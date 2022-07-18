const settingsForm = document.querySelector('.settings-form');
const messagesDiv = document.querySelector('.messages');

const initialize = (channel, token) => {
  settingsForm.remove();

  for (let i = 0; i < 9; i++) {
    const messageDiv = document.createElement('div');

    messageDiv.classList.add('message', `message-${i}`);

    messagesDiv.appendChild(messageDiv);
  }

  const messages = {};

  const currentMessages = [];

  let number = 0;

  const addWord = () => {
    const validMessages = Object.entries(messages).filter(
      ([message, count]) => !currentMessages.includes(message) && count >= 3
    );

    const messageToAdd =
      validMessages[Math.floor(Math.random() * validMessages.length)][0];

    currentMessages.push(messageToAdd);

    const messageDiv = document.querySelector(`.message-${number}`);

    messageDiv.onclick = () => client.say(channel, messageToAdd);

    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageText.innerHTML = messageToAdd;
    messageDiv.appendChild(messageText);

    const messageBar = document.createElement('div');
    messageBar.classList.add('message-bar');
    messageDiv.appendChild(messageBar);

    setTimeout(() => (messageBar.style.width = '0%'), 100);

    setTimeout(() => {
      currentMessages.shift();

      messageText.remove();
      messageBar.remove();

      messageText.innerHTML = '';
    }, 1000 * 9);

    if (number < 8) {
      number++;
    } else {
      number = 0;
    }
  };

  const client = new tmi.client({
    channels: [channel],
    identity: {
      username: 'test',
      password: token,
    },
  });

  client.connect();

  client.on('message', (channel, tags, message, self) => {
    messages[message] = messages[message] ? messages[message] + 1 : 1;

    setTimeout(() => {
      if (messages[message] - 1 === 0) {
        delete messages[message];
      } else {
        messages[message] = messages[message] - 1;
      }
    }, 1000 * 10);
  });

  setInterval(addWord, 1000);
};

settingsForm.onsubmit = (event) => {
  event.preventDefault();

  initialize(event.target.channel.value, event.target.token.value);
};
