var SpeedTracker = (function ($) {
  function bindEvents() {
    $('form[name="toolkitEncrypt"]').submit(function () {
      var $target = $('.js-encrypted-text');
      var baseUrl = $(this).attr('action');
      var key = $(this).find('[name="key"]').val();
      var text = $(this).find('[name="text"]').val();

      var url = baseUrl + '/encrypt/' + key + '/' + encodeURIComponent(text);

      $target.text('Encrypting...');

      $.get(url, function (data) {
        $target.text(data);
      });

      return false;
    })
  }

  $(document).init(function () {
    bindEvents();
  })
})(jQuery);
