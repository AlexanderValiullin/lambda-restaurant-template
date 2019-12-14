import jQuery from 'jquery';

(function($) {
  $.fn.navBar = function(options) {
    // Указатель на экземпляр панели навигации
    let plugin = this;

    // Разбираем параметры
    let settings = $.extend({
      selfInitClass: undefined,
      selfScrolledClass: undefined,
      selfSmallClass: undefined,
      relatedParent: undefined,
      parentInitClass: undefined,
      parentScrolledClass: undefined,
      parentSmallClass: undefined,
      primaryLogo: undefined,
      smallLogo: undefined,
      collapseOn: 0
    }, options);

    // jQuery объекты документа и окна
    let $document = $(document);
    let $window = $(window);

    // jQuery объекты для интерактивных элементов панели навигации
    let $parent = $(plugin).closest(settings.relatedParent);
    let $logo = $(plugin).find(settings.primaryLogo);
    let $small = $(plugin).find(settings.smallLogo);
    let $toggler = $(plugin).find('[data-target]');
    let $collapse = $(plugin).find($toggler.data('target'));

    // Основная и дополнительная картинки в логотипе
    let $image = $(settings.primaryLogo).find('img');
    const logoImage = {
      baseSrc: $image ? $image.attr('src') : undefined,
      altSrc: $image ? $image.data('alt-src') : undefined
    };

    // Таймеры и продолжительность их паузы
    const timers = {
      resize: null,
      scroll: null,
      delay: 250
    };

    // Текущее состояние навигационной панели
    const currentState = {
      mobile: false,
      scrolled: false,
      maximized: false
    };

    // Изменяем логотип в зависимости от размера экрана
    plugin.toggleLogo = function(state) {
      if (!$logo || !$small) return;

      if (state.mobile) {
        $logo.hide();
        $small.show();
      }
      else {
        $small.hide();
        $logo.show();
      }
    };

    // Изменяем стили оформления панели навигации
    plugin.toggleStyles = function(state) {
      let $navbar = $(plugin);

      if (state.mobile) {
        if (settings.selfInitClass)
          $navbar.removeClass(settings.selfInitClass);
        if (settings.parentInitClass)
          $parent.removeClass(settings.parentInitClass);

        if (settings.selfScrolledClass)
          $navbar.removeClass(settings.selfScrolledClass);
        if (settings.parentScrolledClass)
          $parent.removeClass(settings.parentScrolledClass);

        if (settings.parentSmallClass)
          $parent.addClass(settings.parentSmallClass);
        if (settings.selfSmallClass)
          $navbar.addClass(settings.selfSmallClass);
      }
      else {
        if (settings.selfSmallClass)
          $navbar.removeClass(settings.selfSmallClass);
        if (settings.parentSmallClass)
          $parent.removeClass(settings.parentSmallClass);

        if (state.scrolled) {
          if (settings.selfInitClass)
            $navbar.removeClass(settings.selfInitClass);
          if (settings.parentInitClass)
            $parent.removeClass(settings.parentInitClass);

          if (settings.parentScrolledClass)
            $parent.addClass(settings.parentScrolledClass);
          if (settings.selfScrolledClass)
            $navbar.addClass(settings.selfScrolledClass);
          if ($image && logoImage.altSrc)
            $image.attr('src', logoImage.altSrc);
        }
        else {
          if (settings.selfScrolledClass)
            $navbar.removeClass(settings.selfScrolledClass);
          if (settings.parentScrolledClass)
            $parent.removeClass(settings.parentScrolledClass);

          if (settings.parentInitClass)
            $parent.addClass(settings.parentInitClass);
          if (settings.selfInitClass)
            $navbar.addClass(settings.selfInitClass);
          if ($image && logoImage.baseSrc)
            $image.attr('src', logoImage.baseSrc);
        }
      }
    };

    // Скрываем меню и отображаем кнопку переключения
    plugin.toggleNavbar = function(state) {
      if (!$toggler || !$collapse) return;

      if (state.mobile) {
        $collapse.hide();
        $toggler.show();
      }
      else {
        $toggler.hide();
        $collapse.show();
      }
    };

    // Разворачиваем меню в мобильной версии
    plugin.maximizeMenu = function(state) {
      if (state.mobile) {
        if (state.maximized) {
          $toggler.addClass('active');
          let height = Math.floor($window.height() - $parent.height());
          $collapse.height(height);
          $collapse.show();
          $collapse.addClass('show');
        }
        else {
          $toggler.removeClass('active');
          $collapse.removeAttr('style');
          $collapse.removeClass('show');
          $collapse.hide();
        }
      }
    };

    // Задаём начальное состояние
    $document.ready(function() {
      let $navbar = $(plugin);

      currentState.mobile = $window.width() <= settings.collapseOn;
      currentState.scrolled = $navbar.scrollTop() > $parent.height();
      currentState.maximized = false;

      plugin.toggleLogo(currentState);
      plugin.toggleNavbar(currentState);
      plugin.toggleStyles(currentState);
    });

    // Обрабатываем изменение ширины окна
    $window.resize(function() {
      if (timers.resize) clearTimeout(timers.resize);

      timers.resize = setTimeout(function() {
        timers.resize = null;

        if ($window.width() <= settings.collapseOn)
          currentState.mobile = true;
        else
          currentState.mobile = false;

        currentState.maximized = false;
        plugin.maximizeMenu(currentState);
        plugin.toggleLogo(currentState);
        plugin.toggleNavbar(currentState);
        plugin.toggleStyles(currentState);
      }, timers.delay);
    });

    // Обрабатываем прокрутку окна
    $window.scroll(function() {
      if (timers.scroll) clearTimeout(timers.scroll);

      timers.scroll = setTimeout(function() {
        timers.scroll = null;

        if ($window.scrollTop() > $parent.height())
          currentState.scrolled = true;
        else
          currentState.scrolled = false;

        currentState.maximized = false;
        plugin.maximizeMenu(currentState);
        plugin.toggleStyles(currentState);
      }, timers.delay);
    });

    // Обрабатываем нажатие на кнопку вызова меню
    $toggler.click(function() {
      currentState.maximized = !currentState.maximized;
      plugin.maximizeMenu(currentState);
    });

    // Обрабатываем нажатие по ссылкам в меню
    $collapse.click(function() {
      let $target = $(event.target);

      if ($target.is('a')) {
        currentState.maximized = false;
        plugin.maximizeMenu(currentState);
      }
    });
  };
}) (jQuery);
