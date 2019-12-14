global.jQuery = require('jquery');
global.$ = jQuery;

require('./scroll.js');
require('./components/navbar.js');
require('./fx/animate.js');
require('owl.carousel');

$(document).ready(function() {
  let mobileOn = 992;

  // Плавная прокрутка
  let $links = $('a[href^="#"]');
  $links.smoothScroll({
    duration: 'slow'
  });

  // Панель навигации
  let $navbar = $('#main-navbar');
  $navbar.navBar({
    selfInitClass: 'navbar-light',
    selfScrolledClass: 'navbar-dark',
    selfSmallClass: 'navbar-small',
    relatedParent: '.header',
    parentInitClass: 'header-light',
    parentScrolledClass: 'header-dark',
    parentSmallClass: 'header-dark',
    primaryLogo: '.navbar-logo-big',
    smallLogo: '.navbar-logo-small',
    collapseOn: mobileOn
  });

  // Анимация появляющихся секций
  let $animate = $('.animate-it');
  $animate.animateIt({
    animateClass: 'animated',
    defaultAnimation: 'fadeIn',
    //repeat: true,
    disableOn: mobileOn
  });

  // Отзывы клиентов
  let $slider = $('#reviews-slider');
  $slider.owlCarousel({
    loop: true,
    autoplayTimeout: 7000,
    smartSpeed: 500,
    items: 1,
    responsive: {
      0: {
        autoplay: false
      },
      992: {
        autoplay: true,
        autoplayHoverPause: true
      }
    }
  });
});

// Выводим диагностическое сообщение в консоль
if (process.env.NODE_ENV === 'development') {
  console.log('It\'s alive!');
}
