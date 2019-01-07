var socket = io();

socket.on('connect', function () {
  console.log("Connected to server");
})

socket.on('welcome', function (greeting) {
  console.log(greeting);
})

socket.emit('createMessage', {
  from: "yoooo",
  text: "im here"
}, function (data) {
  console.log('Aye Aye Cap', data);
})

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault()

  var messageTextBox = jQuery('[name=Message]')

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
    messageTextBox.val('')
  })
})

socket.on('disconnect', function () {
  console.log("Unable to connect");
})

socket.on('newMessage', function (email) {
  console.log("You got mail!", email);
  var li = jQuery('<li></li>')
  li.text(`${email.from}: ${email.text}`)

  jQuery('#log').append(li)
})

var locationButton = jQuery('#send_location')
locationButton.on('click', function () {
  locationButton.attr('disabled', 'disabled').text('Sending Location to Scottie')
  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send Location')
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  })
})
