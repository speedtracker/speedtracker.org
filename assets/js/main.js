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

    $('form[name="connect"]').submit(function () {
      var $target = $('.js-connect-result');
      var baseUrl = $(this).attr('action');

      var username = $(this).find('[name="username"]').val();
      var repository = $(this).find('[name="repository"]').val();
      var branch = $(this).find('[name="branch"]').val();

      var url = baseUrl + '/' + username + '/' + repository + '/' + branch

      $target.text('Hang on...');

      $.get(url, function (data) {
        $target.text(data);
      }).fail(function () {
        $target.html('Oops, something went wrong. Did you invite <strong>speedtracker-bot</strong> to your repository?');
      });

      return false;
    })
  }

  $(document).init(function () {
    bindEvents();
  })
})(jQuery);
