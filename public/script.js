document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const messageInput = document.getElementById('message');
  const totalSent = document.getElementById('total-sent');
  const sendButton = document.getElementById('send-button');
  const responseText = document.getElementById('response');
  let spamInterval;

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
    sendButton.textContent = 'Spamming in Progress';
    usernameInput.setAttribute('readonly', true);
    messageInput.setAttribute('readonly', true);

    if (!spamInterval) {
      spamInterval = setInterval(async function spamFunction() {
        try {
          const data = await callSpam();
          totalSent.textContent = data.update;
          responseText.textContent = data.status;

          if (data.status !== 'Sent Success' ) {
            if (data.status.includes("head")) {
              throw new Error('Error has occurred: Click Spam Now! again');
            }
            throw new Error(response.status);
          }
        } catch (err) {
          clearInterval(spamInterval);
          spamInterval = null;
          sendButton.disabled = false;
          sendButton.textContent = 'Spam Now!';
          usernameInput.removeAttribute('readonly');
          messageInput.removeAttribute('readonly');
        } 
      }, 2100); 
    }
  });

  async function callSpam() {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: usernameInput.value,
        message: messageInput.value,
        total: totalSent.textContent
      })
    };

    const response = await fetch('/api/start', requestOptions);

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

