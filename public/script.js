document.addEventListener('DOMContentLoaded', () => {
  let rand_data = "";
  const usernameInput = document.getElementById('username');
  const messageInput = document.getElementById('message');
  const totalSent = document.getElementById('total-sent');
  const totalReq = document.getElementById('total-req');
  const randomButton = document.getElementById('random');
  const sendButton = document.getElementById('send-button');
  const responseText = document.getElementById('response');
  let spamInterval;
  let isRandom = false;

  let sentTotal = totalSent.innerHTML;
  let total_sent = parseInt(sentTotal);

  let reqTotal = totalReq.innerHTML;
  let req_sent = parseInt(reqTotal);

  async function randomMessage() {
    if (rand_data == "") {
      const messages = await fetch('./messages.json');
      rand_data = await messages.json();
    }
    messageInput.value = rand_data[Math.floor(Math.random() * rand_data.length)];
  }

  randomButton.addEventListener('click', () => {
    if (isRandom) {
      randomButton.style.background = "rgba(255, 255, 255, 0.3)";
      isRandom = false;
      return;
    } else {
      randomButton.style.background = "rgba(11, 156, 49, 0.5)";
      isRandom = true;
      randomMessage();
    }
  });

  sendButton.addEventListener('click', async () => {
    const usernameValue = usernameInput.value;
    const messageValue = messageInput.value;

    if (!usernameValue) {
      alert('Please enter a username');
      return;
    }

    if (!messageValue) {
      alert('Please enter a message');
      return;
    }

    sendButton.disabled = true;
    sendButton.textContent = 'Spamming in Progress.';
    usernameInput.setAttribute('readonly', true);
    messageInput.setAttribute('readonly', true);

    if (!spamInterval) {
      spamInterval = setInterval(async function spamFunction() {
        try {
          const data = await callSpam();
          totalSent.textContent = (data.status == "Sent Success" ? ++total_sent : total_sent);
          responseText.textContent = data.status;
        } catch (err) {
          const data = await callSpam();
        } 
      }, 500); 
    }
  });

  async function callSpam() {
    req_sent++;
    totalReq.textContent = req_sent;
    if (isRandom) {
      randomMessage();
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: usernameInput.value,
        message: messageInput.value
      })
    };

    const response = await fetch('/api/send', requestOptions);

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      const data = await response.json();
      throw new Error(data.error || 'Something went wrong');
    }

    const data = await response.json();
    return data; 
  }
});

