$(function(){var s=$("li").css("width");$("li").css("height",s);$("li").css("lineHeight",s);var i=$("#wordsearch").css("width");$("#wordsearch").css("height",i)});causeRepaintsOn=$("h1, h2, h3, p");$(window).resize(function(){causeRepaintsOn.css("z-index",1)});$(window).on("resize",function(){var s=$(".one").css("width");$("li").css("height",s);$("li").css("lineHeight",s);var i=$("#wordsearch").css("width");$("#wordsearch").css("height",i)});