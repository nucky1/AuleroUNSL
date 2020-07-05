$(function()
{
    $(document).on('click', '.btn-search', function(e)
    {
        e.preventDefault();

        var controlForm = $('.controls form:first'),
            currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);

        newEntry.find('input').val('');
        controlForm.find('.entry:not(:last) .btn-search')
            .removeClass('btn-search').addClass('btn-search-line')
            .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-search-line', function(e)
    {
        $(this).parents('.entry:first').remove();

        e.preventDefault();
        return false;
    });
});
