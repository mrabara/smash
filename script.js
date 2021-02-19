$(document).ready(function () {
  // scrollspy initialization
  $('.scrollspy').scrollSpy({
    scrollOffset: 5,
    throttle: 1000,
  });

  //modal initialization
  $('.modal').modal();

  //tooltip initialization
  $('.tooltipped').tooltip();
});

$('.btn').click(() => new Audio('./sound/click.mp3').play());
$('.btn-floating').click(() => new Audio('./sound/click.mp3').play());
