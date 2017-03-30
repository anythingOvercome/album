$(function() {
    $(".piclistshow li").hover(function() {
            $(this).css("background", "#FAFAFA")
        },
        function() {
            $(this).css("background", "white")
        });
    $(".piclistshow li").last().css("border-bottom", "none");
    $(".piclistshow li").each(function() {
        var curindex = $(this).index(".piclistshow li") + 1;
        if (curindex % 4 == 0) {
            $(this).css({
                "border-right": "none",
                "width": "251px"
            })
        }
    });
    $(document).keydown(function(event) {
        var key = event.keyCode;
        if (key == 37) {
            preclick()
        } else {
            if (key == 39) {
                nextclick()
            }
        }
        /*var firstdisplay = $(".firsttop").css("display");
        var enddisplay = $(".endtop").css("display");
        if (firstdisplay == "none" && enddisplay == "none") {

        } else {
            if (key == 27) {
                $(".firsttop").css("display", "none");
                $(".bodymodal").css("display", "none");
                $(".endtop").css("display", "none")
            }
        }*/
    });

    var firstpic = $(".pic-list-small ul li").first().find("img");
    var firstsrc = firstpic.attr("bigimg");
    var firsttxt = firstpic.attr("text");
    $("#pic1").attr("src", firstsrc);
    firstpic.addClass("selectpic");
    $(".pic-text").text(firsttxt);
    $("#preArrow").hover(function() {
            $("#preArrow_A").css("display", "block")
        },
        function() {
            $("#preArrow_A").css("display", "none")
        });
    $("#nextArrow").hover(function() {
            $("#nextArrow_A").css("display", "block")
        },
        function() {
            $("#nextArrow_A").css("display", "none")
        });
    var getli = $(".pic-list-small ul li");
    //console.log(getli)
    function nextclick() {
    	var getli = $(".pic-list-small ul li");
        var currrentindex = parseFloat($("#pic1").attr("curindex"));
        var length = getli.length;
        //console.log(length+'=========')
        if (currrentindex != (length - 1)) {
            var curli = getli.eq(currrentindex);
            if (currrentindex > 3) {
                getli.eq(currrentindex - 4).css("display", "none");
                getli.eq(currrentindex + 1).css("width", "20%").css("display", "block")
            }
            var curnextli = getli.eq(currrentindex + 1);
            var curnextsrc = curnextli.find("img").attr("bigimg");
            var curnexttxt = curnextli.find("img").attr("text");
            curli.find("img").removeClass("selectpic");
            curnextli.find("img").addClass("selectpic");
            $("#pic1").attr("src", curnextsrc);
            $("#pic1").attr("curindex", currrentindex + 1);
            $(".pic-text").text(curnexttxt);
            $(".pic-number span").text(currrentindex + 2)
        } else {
            layer.msg('最后一张图片');
        }
    }
    $("#nextArrow_B").click(function() {
        nextclick()
    });
    $("#nextArrow").click(function() {
        nextclick()
    });
    function preclick() {
    	var getli = $(".pic-list-small ul li");
        var currrentindex = parseFloat($("#pic1").attr("curindex"));
        if (currrentindex != 0) {
            var curli = getli.eq(currrentindex);
            var length = getli.length;
            if (currrentindex <= (length - 5)) {
                getli.eq(currrentindex + 4).css("display", "none");
                getli.eq(currrentindex - 1).css("width", "20%").css("display", "block")
            }
            var curnextli = getli.eq(currrentindex - 1);
            var curnextsrc = curnextli.find("img").attr("bigimg");
            var curnexttxt = curnextli.find("img").attr("text");
            curli.find("img").removeClass("selectpic");
            curnextli.find("img").addClass("selectpic");
            $("#pic1").attr("src", curnextsrc);
            $(".pic-text").text(curnexttxt);
            $("#pic1").attr("curindex", currrentindex - 1);
            $(".pic-number span").text(currrentindex)
        } else {
            layer.msg('当前第一张图');
        }
    }
    $("#preArrow_B").click(function() {
        preclick()
    });
    $("#preArrow").click(function() {
        preclick()
    });
    getli.click(function() {
        var currentliindex = $(this).index(".pic-list-small ul li");
        $(".pic-list-small ul li img[class='selectpic']").removeClass("selectpic");
        var currentli = getli.eq(currentliindex);
        currentli.find("img").addClass("selectpic");
        var bigimgsrc = currentli.find("img").attr("bigimg");
        var curnexttxt = currentli.find("img").attr("text");
        $("#pic1").attr("src", bigimgsrc);
        $("#pic1").attr("curindex", currentliindex);
        $(".pic-text").text(curnexttxt);
        $(".pic-number span").text(currentliindex + 1)
    });
    $(".pic-list-show li").click(function() {
        var curli = $(this).index(".pic-list-show li");
        showbigimage();
        $(".pic-list-small ul li img[class='selectpic']").removeClass("selectpic");
        var currentli = getli.eq(curli);
        currentli.find("img").addClass("selectpic");
        var bigimgsrc = currentli.find("img").attr("bigimg");
        var curnexttxt = currentli.find("img").attr("text");
        $("#pic1").attr("src", bigimgsrc);
        $("#pic1").attr("curindex", curli);
        $(".pic-text").text(curnexttxt);
        $(".pic-number span").text(curli + 1);
        $(".pic-list-small li").css("display", "block");
        if (curli >= 5) {
            var cha = curli - 5;
            for (var i = 0; i <= cha; i++) {
                getli.eq(i).css("display", "none")
            }
        }
    });
    setblock();
    function setblock() {
        var left = $(window).width() / 2 - 300;
        $(".firsttop").css("left", left);
        $(".endtop").css("left", left)
    }
    $(window).resize(function() {
        setblock()
    });
    $(".closebtn1").click(function() {
        $(".firsttop").css("display", "none");
        $(".bodymodal").css("display", "none")
    });
    $(".closebtn2").click(function() {
        $(".endtop").css("display", "none");
        $(".bodymodal").css("display", "none")
    });
    $(".replaybtn1").click(function() {
        $(".firsttop").css("display", "none");
        $(".bodymodal").css("display", "none")
    });
    $(".replaybtn2").click(function() {
        $(".endtop").css("display", "none");
        $(".bodymodal").css("display", "none");
        $(".detail_picbot_mid ul li img[class='selectpic']").removeClass("selectpic");
        $(".detail_picbot_mid ul li").eq(0).find("img").addClass("selectpic");
        var bigimgsrc = $(".detail_picbot_mid ul li").eq(0).find("img").attr("bigimg");
        $("#pic1").attr("src", bigimgsrc);
        $("#pic1").attr("curindex", 0)
    });
    $("a[data-index='list']").click(function() {
        $(".pic-show").css("display", "none");
        $(".pic-list-show").css("display", "block");
        $("[data-toggle='list']").addClass('hide');
        $("[data-toggle='image']").removeClass('hide')

    });
    $("a[data-index='image']").click(function() {
        showbigimage();
    });
    function showbigimage() {
        $(".pic-show").css("display", "block");
        $(".pic-list-show").css("display", "none");
        $("[data-toggle='list']").removeClass('hide');
        $("[data-toggle='image']").addClass('hide')
    }
    $(".rank ul").first().css("display", "block");
    $(".ranknext").click(function() {
        var showindex = $(this).attr("show");
        var show = parseInt(showindex) + 1;
        var length = $(".rank ul").length;
        if (show < length) {
            $(".rank ul").eq(showindex).css("display", "none");
            $(".rank ul").eq(show).css("display", "block");
            $(this).attr("show", show);
            $(".rank ul").eq(show).find("img").lazyload()
        } else {
            $(".rank ul").css("display", "none");
            $(".rank ul").first().css("display", "block");
            $(this).attr("show", 0);
            $(".rank ul").first().find("img").lazyload()
        }
    });
    $(".tuijian").click(function() {
        var showindex = $(this).attr("show");
        var show = parseInt(showindex) + 1;
        var length = $(".rank1 ul").length;
        if (show < length) {
            $(".rank1 ul").eq(showindex).css("display", "none");
            $(".rank1 ul").eq(show).css("display", "block");
            $(this).attr("show", show)
        } else {
            $(".rank1 ul").css("display", "none");
            $(".rank1 ul").first().css("display", "block");
            $(this).attr("show", 0)
        }
    });
});