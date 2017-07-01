function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.querySelector('.purchase_form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}

$(function(){

  var stripe = Stripe('pk_test_uRzmnFDP58RQeTEq25nKkmRy');
  var elements = stripe.elements();

  // Custom styling can be passed to options when creating an Element.
  var style = {
    base: {
      color: '#303238',
      fontSize: '16px',
      lineHeight: '48px',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#ccc',
      },
    },
    invalid: {
      color: '#e5424d',
      ':focus': {
        color: '#303238',
      },
    },
  };

  // Create an instance of the card Element
  var card = elements.create('card', {style: style});

  // Add an instance of the card Element into the `card-element` <div>
  card.mount('#card-element');

  card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });


  $('form').submit(function(event){
    event.preventDefault();


    var form = $(this);
    form.find('.submit').attr('disabled', true);

    stripe.createToken(card).then(function(result) {

      if (result.error) {
        // Inform the user if there was an error
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server
        stripeTokenHandler(result.token);
      }
    });    
  });

});