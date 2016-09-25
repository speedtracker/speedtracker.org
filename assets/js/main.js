var SpeedTracker = (function ($) {
  var $console = $('.js-console');

  function writeToConsole(message) {
    $console.append('<p>' + message + '</p>');

    // Auto-scroll
    $console.scrollTop($console[0].scrollHeight);
  }

  function resolvePlaceholders(subject, dictionary) {
    var matches = subject.match(/{(.*?)}/g)

    if (!matches) return subject

    matches.forEach(function (match) {
      var escapedMatch = match.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      var property = match.slice(1, -1)

      subject = subject.replace(new RegExp(escapedMatch, 'g'), dictionary[property])
    })

    return subject
  }

  function getFormData(form) {
    var serialisedArray = $(form).serializeArray();
    var payload = {}

    serialisedArray.forEach(function (field) {
      payload[field.name] = field.value;
    })

    return payload;
  }

  function bindEvents() {
    $('.js-form').submit(function () {
      var data = getFormData(this);
      var url = resolvePlaceholders($(this).attr('action'), data);
      var method = $(this).attr('method') || 'GET';

      var ajaxOptions = {
        method: method,
        url: url
      };

      if (method === 'POST') {
        ajaxOptions.data = data;
      }

      writeToConsole('Hang on...');

      $.ajax(ajaxOptions).done(function (response) {
        writeToConsole('--> ' + response);
      }).fail(function (error) {
        var errorMessage = 'Unknown';

        if (error.responseText) {
          try {
            var parsedError = JSON.parse(error.responseText);

            if (parsedError.code) {
              errorMessage = parsedError.code
            }
          } catch (e) {
            errorMessage = error.responseText
          }
        }

        writeToConsole('(!) Error: "' + errorMessage + '"');
      })

      return false;
    });
  }

  $(document).init(function () {
    bindEvents();
  })
})(jQuery);
