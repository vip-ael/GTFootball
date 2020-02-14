// function for sending push notifications 
const sendPush = () => {
    console.log('sending push');
}

// connect button with sending push notifications 
const button = document.querySelector('#send-push');
button.addEventListener('click', sendPush);