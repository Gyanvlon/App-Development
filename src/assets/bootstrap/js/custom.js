$(".form-group input").change(function() {
    if ($(this).val() != "") {
       $(this).addClass('filled');
    } else {
       $(this).removeClass('filled');
    }
 });

$(".form-group input").each(function() {
    if ($(this).val() != "") {
       $(this).addClass('filled');
    } else {
       $(this).removeClass('filled');
    }
});

$(".form-control").focus(function(){
  $(this).parent().addClass("focused");

}).blur(function(){
  $(this).parent().removeClass("focused");
});

$('form').validator({
    validHandlers: {
        '.customhandler':function(input) {
            //may do some formatting before validating
            input.val(input.val().toUpperCase());
            //return true if valid
            return input.val() === 'JQUERY' ? true : false;
        }
    }
});