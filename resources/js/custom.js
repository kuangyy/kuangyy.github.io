$(function () {
    // to top
    $(window).on("scroll", function () {
        let top = document.documentElement.scrollTop || document.body.scrollTop;
        top > 300 ? $(".k-totop").show(200) : $(".k-totop").hide(100);
    })
    $(".k-totop").on("click", function () {
        $("body,html").animate({scrollTop: 0}, 200, "swing")
    })
})