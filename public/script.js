document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const messageInput = document.getElementById('message');
  const totalSent = document.getElementById('total-sent');
  const totalReq = document.getElementById('total-req');
  const sendButton = document.getElementById('send-button');
  const responseText = document.getElementById('response');
  let spamInterval;

  let sentTotal = totalSent.innerHTML;
  let total_sent = parseInt(sentTotal);

  let reqTotal = totalReq.innerHTML;
  let req_sent = parseInt(reqTotal);

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

