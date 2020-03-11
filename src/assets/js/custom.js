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

$.fn.ashCordian = function() {
  
   var container = $(this);
   container.find('.accord-heading').click(function() {
    $("#accord1 li").removeClass("active");
    if($(this).siblings('.accord-content').css('display') == 'block') {

       container.find('.accord-content').slideUp(250);
       $(this).parents('li').removeClass("active");
    
    } else {
    
       container.find('.accord-content').slideUp(250);
       $(this).siblings('.accord-content').slideDown(250);
       $(this).parents('li').addClass("active");
    
    }
   });
 };
 $('#accord1').ashCordian();

// $('form').validator({
//     validHandlers: {
//         '.customhandler':function(input) {
//             //may do some formatting before validating
//             input.val(input.val().toUpperCase());
//             //return true if valid
//             return input.val() === 'JQUERY' ? true : false;
//         }
//     }
// });