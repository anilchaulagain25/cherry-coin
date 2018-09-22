(function($) {
    $.fn.ButtonLoading = function(text, toDisable) {
        return this.each(function() {
            text = text || ($(this).prop('disabled') ? 'Submit' : '<i class="fa fa-circle-o-notch fa-spin aria-hidden="true"></i> Loading ');
            toDisable = toDisable || !$(this).prop('disabled');
            $(this)
                .focus()
                .html(text)
                .prop('disabled', toDisable);
        });
    };
})(jQuery);