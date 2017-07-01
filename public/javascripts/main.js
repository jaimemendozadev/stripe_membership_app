$(function(){

  var stripe = Stripe('pk_test_uRzmnFDP58RQeTEq25nKkmRy');
  var elements = stripe.elements();

  // Custom styling can be passed to options when creating an Element.
  var style = {
    base: {
      // Add your base input styles here. For example:
      fontSize: '16px',
      lineHeight: '24px'
    }
  };

  // Create an instance of the card Element
  var card = elements.create('card', {style: style});

  // Add an instance of the card Element into the `card-element` <div>
  card.mount('#card-element');


  $('form').submit(function(event){
    var form = $(this);
    form.find('.submit').attr('disabled', true);

    stripe.createToken(card).then(function(result){
      if(response.error){
        form.find('.submit').attr('disabled', false);
        $('.error_message').html(response.error.message);
      }
      else {
        $('<input>').attr({
          type: 'hidden',
          value: response.id,
          name: 'stripeToken'
        }).appendTo(form);
        form.get(0).submit();
      }
    });

/*
    Stripe.createToken(this, function(status, response){
      if(response.error){
        form.find('.submit').attr('disabled', false);
        $('.error_message').html(response.error.message);
      }
      else {
        $('<input>').attr({
          type: 'hidden',
          value: response.id,
          name: 'stripeToken'
        }).appendTo(form);
        form.get(0).submit();
      }
    });
*/
    event.preventDefault();
  });
});