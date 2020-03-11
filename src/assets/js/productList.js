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