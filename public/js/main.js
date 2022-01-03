const chat_form=document.getElementById('chat-form');
const chat_messages=document.querySelector('.chat-messages');
const room_name=document.getElementById('room-name');
const userList=document.getElementById('users');
//getting username and room from the url
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})
const socket=io();
socket.emit('joinRoom',{username,room});
socket.on('roomInfo',({users,room})=>{

    showUsers(users);
    showRoom(room);
  })
  
  socket.on('message',message=>{
      console.log(message);
      outputMessage(message);
})
// for listening the bot messages
socket.on('botMessage',message=>{
    // console.log(message);
    outputBotMessage(message);
})


//submit chat message
chat_form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;
    // emit message to the server
    socket.emit('chat-message',msg);
    // clearing inputs
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})
function outputMessage(msg){
    const div=document.createElement('div');
    if(msg.username===username){
        div.classList.add('right');
    }
    else{
        div.classList.add('left');
    }
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.message}
    </p>
    `
    chat_messages.appendChild(div);
    chat_messages.scrollTop=chat_messages.scrollHeight;

}

// for showing up the bot messages
function outputBotMessage(message){
    const div=document.createElement('div');
    div.classList.add('div-style');
    div.innerHTML=`<p class="meta">${message} </p>`;
    chat_messages.appendChild(div);
    chat_messages.scrollTop=chat_messages.scrollHeight;
}

function showRoom(room){
    room_name.innerText=room;
}
function showUsers(users){
    userList.innerHTML=`${
        users.map(user=>`<li>${user.username}</li>`)
        .join('')}`
}

