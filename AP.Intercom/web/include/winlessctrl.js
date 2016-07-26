//for Digital zoom
var str_innerHTML;
var g_lPluginDZWidth = 160;
var g_lPluginDZHeight = 120;
var g_iDragWinLeftX = 0;
var g_iDragWinTopY = 0;
var g_iDragWinWidth = g_lPluginDZWidth;
var g_iDragWinHeight = g_lPluginDZHeight;

var bZoomEnabled = false;
var bPlayEnabled = true;
var bStopEnabled = false;
var bRecEnabled = false;
var bVolumeEnabled = false;
var bMuteEnabled = false;
var bTalkEnabled = false;
var bMicVolumeEnabled = false;
var bMicMuteEnabled = false;
var bFullscreen = false;
var bContainVideo = false;  //add by Kent 20081124, don't know what it can do.
var bContainAudio = false;  //add by Kent 20081124, to adjust whether a streaming contains audio or not

var bInitZoomFrame = false;
var MJPEGFrameLevelCount = 8; //level 1 to level 8 , level 0 is fixed at frame interval = 4000
var MJPEGMaxFrameInterval = 4000;

//zoom
function WinLessPluginCtrlShowDZPlugin() {
    if (bIsWinMSIE) {
        document.getElementById(PLUGIN_ID).SetDigitalZoomDisplayWindowInfo(document.getElementById("DZPlugin").DigitalZoomDrawFrameInfo, document.getElementById("DZPlugin").DigitalZoomDisplayPlugin, document.getElementById("DZPlugin").DigitalZoomPluginInst/*, 160, 120*/);
    }
    else if (bIsFireFox || bIsChrome) {
        document.getElementById(PLUGIN_ID).SetDigitalZoomDisplayWindowInfo(document.getElementById("DZPlugin").DigitalZoomDrawFrameInfo, document.getElementById("DZPlugin").DigitalZoomDisplayPlugin, document.getElementById("DZPlugin").NPPInstance/*, 160, 120*/);
    }
}

function WinLessPluginCtrlZoomEnable() {
    if ($("#DZDisable").attr("checked") != true) {
        bZoomEnabled = true;
        $("#zoom-slider").slider("enable");
        document.getElementById(PLUGIN_ID).DigitalZoomEnabled = true;
        WinLessPluginCtrlShowDZPlugin();
    }
    else {
        bZoomEnabled = false;
        $("#zoom-slider").slider("disable");
        document.getElementById(PLUGIN_ID).DigitalZoomEnabled = false;
    }
}

function WinLessPluginCtrlCatchPosition(oEvent) {
    if (navigator.userAgent.match("Trident") != null || navigator.userAgent.match("MSIE") != null) {
        g_iDragWinLeftX = oEvent.offsetX - (g_iDragWinWidth / 2);
        g_iDragWinTopY = oEvent.offsetY - (g_iDragWinHeight / 2);
    }
    else {
        g_iDragWinLeftX = oEvent.layerX - (g_iDragWinWidth / 2);
        g_iDragWinTopY = oEvent.layerY - (g_iDragWinHeight / 2);
    }
    if (g_iDragWinLeftX <= 0) {
        g_iDragWinLeftX = 0;
    }
    if (g_iDragWinLeftX >= (g_lPluginDZWidth - g_iDragWinWidth)) {
        g_iDragWinLeftX = g_lPluginDZWidth - g_iDragWinWidth;
    }
    if (g_iDragWinTopY <= 0) {
        g_iDragWinTopY = 0;
    }
    if (g_iDragWinTopY >= (g_lPluginDZHeight - g_iDragWinHeight)) {
        g_iDragWinTopY = g_lPluginDZHeight - g_iDragWinHeight;
    }

    $("#drag-window").css("left", g_iDragWinLeftX).css("top", g_iDragWinTopY);
    //console.log("Catch Pos " + g_iDragWinLeftX + ", " + g_iDragWinTopY + ", " + g_iDragWinWidth + ", " + g_iDragWinHeight);
    document.getElementById(PLUGIN_ID).SetDigitalZoomEditWindowPos(g_iDragWinLeftX, g_iDragWinTopY, g_iDragWinWidth, g_iDragWinHeight);
    //console.log(g_iDragWinLeftX + ",  " + g_iDragWinTopY);
    $("#dz-top").html(g_iDragWinTopY);
    $("#dz-left").html(g_iDragWinLeftX);
    $("#dz-width").html(g_iDragWinWidth);
    $("#dz-height").html(g_iDragWinHeight);
}

function WinLessPluginCtrlZoomEdit(event, bool, bIsButton) {
    var evt;
    var showZoomFrame;

    $.ajax({
        url: "/cgi-bin/viewer/getparam.cgi?videoin_c0_rotate",
        cache: false,
        async: false,
        success: function (data) {
            eval(data);
        }
    });

    $("#micvolume-frame").hide();
    $("#volume-frame").hide();

    showZoomFrame = bool;
    if (showZoomFrame) {
        $("#zoom-frame").show();


        if ($("#DZPlugin").length == 0) {
            //insert the digital zooming plugin and dragging window
            if (videoin_c0_rotate == 90 || videoin_c0_rotate == 270) {
                str_innerHTML = "<object id=\"DZPlugin\" style=\"width:120px;height:160px;position:absolute; z-index:1;right:0;\" ";//rotation
            }
            else {
                str_innerHTML = "<object id=\"DZPlugin\" style=\"width:160px;height:120px;position:absolute; z-index:1;right:0;\" ";
            }
            g_lPluginDZWidth = 160;
            g_lPluginDZHeight = 120;
            g_iDragWinWidth = g_lPluginDZWidth;
            g_iDragWinHeight = g_lPluginDZHeight;

            if (bIsWinMSIE) {
                str_innerHTML += "classid=CLSID:" + CLASS_ID + " codebase=\"/" + PLUGIN_NAME + "#version=" + PLUGIN_VER + "\">";
                str_innerHTML += "<param name=\"AutoStartConnection\" value=\"false\">";
                str_innerHTML += "<param name=\"IgnoreCaption\" value=\"true\">";
                str_innerHTML += "<param name=\"IgnoreBorder\" value=\"true\">";
                str_innerHTML += "<param name=\"Stretch\" value=\"true\">";
            }
            else if (bIsFireFox || bIsChrome) {
                str_innerHTML += "type=" + FFTYPE + ">";
                str_innerHTML += "<param name=\"AutoStartConnection\" value=\"0\">";
                str_innerHTML += "<param name=\"IgnoreCaption\" value=\"1\">";
                str_innerHTML += "<param name=\"IgnoreBorder\" value=\"1\">";
                str_innerHTML += "<param name=\"Stretch\" value=\"1\">";
            }
            str_innerHTML += "</object>";
            if (videoin_c0_rotate == 90 || videoin_c0_rotate == 270) {
                str_innerHTML += "<div id=\"DZMask\" onclick=\"WinLessPluginCtrlCatchPosition(event)\" style=\"width:120px;height:160px;position:absolute; z-index:2;right:0\"></div>";
                str_innerHTML += "<div id=\"drag-window\" style=\"border-style:ridge;border-width:2px;width:116px;height:156px;position:absolute; z-index:3;right:0\"></div>";
            }
            else {
                str_innerHTML += "<div id=\"DZMask\" onclick=\"WinLessPluginCtrlCatchPosition(event)\" style=\"width:160px;height:120px;position:absolute; z-index:2;right:0\"></div>";
                str_innerHTML += "<div id=\"drag-window\" style=\"border-style:ridge;border-width:2px;width:156px;height:116px;position:absolute; z-index:3;right:0\"></div>";
            }
            document.getElementById("dz-plugin").innerHTML = str_innerHTML;
        }


        // set DZ display plug-in info to plug-in
        setTimeout(function () {
            setTimeout(function () {
                WinLessPluginCtrlShowDZPlugin();
                //console.log("show " + g_iDragWinLeftX + ", " + g_iDragWinTopY + ", " + g_iDragWinWidth + ", " + g_iDragWinHeight);
                document.getElementById(PLUGIN_ID).SetDigitalZoomEditWindowPos(g_iDragWinLeftX, g_iDragWinTopY, g_iDragWinWidth, g_iDragWinHeight);
            }, 100);
            $("#DZMask").css("background-color", "#fff").css("opacity", "0.0");
            $("#drag-window").css("background-color", "#fff").css("opacity", "0.5")
        }
		, 1);

        //setTimeout("WinLessPluginCtrlShowDZPlugin()", 200);
        //setTimeout("$(\"#DZMask\").css(\"background-color\",\"#fff\").css(\"opacity\",\"0.0\")", 200);
        //setTimeout("$(\"#drag-window\").css(\"background-color\",\"#fff\").css(\"opacity\",\"0.5\")", 200);

        if (bInitZoomFrame == false) {
            //creat zooming slider
            $("#zoom-slider").slider({
                value: 100,
                min: 100,
                max: 400,
                step: 1,
                animate: true,
                range: "min",
                slide: function (event, ui) {
                    g_iDragWinLeftX = Math.round(80 - g_lPluginDZWidth * 50 / ui.value);
                    g_iDragWinTopY = Math.round(60 - g_lPluginDZHeight * 50 / ui.value);
                    g_iDragWinWidth = g_lPluginDZWidth * 100 / ui.value;
                    g_iDragWinHeight = g_lPluginDZHeight * 100 / ui.value;
                    $("#dz-top").html(g_iDragWinTopY);
                    $("#dz-left").html(g_iDragWinLeftX);
                    $("#dz-width").html(g_iDragWinWidth);
                    $("#dz-height").html(g_iDragWinHeight);
                    if (videoin_c0_rotate == 90 || videoin_c0_rotate == 270) {
                        $("#drag-window").css("width", g_iDragWinWidth * (120 / 160) - 4).css("height", g_iDragWinHeight * (160 / 120) - 4).css("left", g_iDragWinLeftX * (120 / 160)).css("top", g_iDragWinTopY * (160 / 120));
                    }
                    else {
                        $("#drag-window").css("width", g_iDragWinWidth - 4).css("height", g_iDragWinHeight - 4).css("left", g_iDragWinLeftX).css("top", g_iDragWinTopY);
                    }
                    //console.log("create zoom " + g_iDragWinLeftX + ", " + g_iDragWinTopY + ", " + g_iDragWinWidth + ", " + g_iDragWinHeight);
                    document.getElementById(PLUGIN_ID).SetDigitalZoomEditWindowPos(g_iDragWinLeftX, g_iDragWinTopY, g_iDragWinWidth, g_iDragWinHeight);
                    document.getElementById("zoomfactor").innerHTML = ui.value + "%";
                }
            }).children("a").attr("hideFocus", true);

            document.getElementById("zoomfactor").innerHTML = $("#zoom-slider").slider("value") + "%";

            //Solve the initial problem
            $("#dz-top").html(g_iDragWinTopY);
            $("#dz-left").html(g_iDragWinLeftX);
            $("#dz-width").html(g_iDragWinWidth);
            $("#dz-height").html(g_iDragWinHeight);

            $("#drag-window").draggable({
                containment: '#dz-plugin',
                scroll: false,
                start: function () {
                    g_iDragWinLeftX = $("#drag-window").position().left;
                    g_iDragWinTopY = $("#drag-window").position().top;
                },
                drag: function () {
                    g_iDragWinLeftX = $("#drag-window").position().left;
                    g_iDragWinTopY = $("#drag-window").position().top;
                    if (g_iDragWinLeftX < 0) g_iDragWinleftX = 0;
                    if (g_iDragWinTopY < 0) g_iDragWinTopY = 0;
                    if (videoin_c0_rotate == 90 || videoin_c0_rotate == 270) {
                        if (g_iDragWinLeftX > 120) g_iDragWinLeftX = 120;
                        if (g_iDragWinTopY > 160) g_iDragWinTopY = 160;
                        g_iDragWinLeftX = parseInt(g_iDragWinLeftX * (160 / 120));
                        g_iDragWinTopY = parseInt(g_iDragWinTopY * (120 / 160));
                    }
                    else {
                        if (g_iDragWinLeftX > 160) g_iDragWinLeftX = 160;
                        if (g_iDragWinTopY > 120) g_iDragWinTopY = 120;
                    }

                    //console.log("drag " + g_iDragWinLeftX + ", " + g_iDragWinTopY + ", " + g_iDragWinWidth + ", " + g_iDragWinHeight);
                    document.getElementById(PLUGIN_ID).SetDigitalZoomEditWindowPos(g_iDragWinLeftX, g_iDragWinTopY, g_iDragWinWidth, g_iDragWinHeight);
                    $("#dz-top").html(g_iDragWinTopY);
                    $("#dz-left").html(g_iDragWinLeftX);
                    $("#dz-width").html(g_iDragWinWidth);
                    $("#dz-height").html(g_iDragWinHeight);
                },
                stop: function () {
                    g_iDragWinLeftX = $("#drag-window").position().left;
                    g_iDragWinTopY = $("#drag-window").position().top;
                    if (g_iDragWinLeftX < 0) g_iDragWinleftX = 0;
                    if (g_iDragWinTopY < 0) g_iDragWinTopY = 0;
                    if (g_iDragWinLeftX + g_iDragWinWidth > 160) g_iDragWinWidth = 160 - g_iDragWinLeftX;
                    if (g_iDragWinTopY > 120) g_iDragWinHeight = 120 - g_iDragWinTopY;

                    if (videoin_c0_rotate == 90 || videoin_c0_rotate == 270) {
                        if (g_iDragWinLeftX > 120) g_iDragWinLeftX = 120;//rotation
                        if (g_iDragWinTopY > 160) g_iDragWinTopY = 160;//rotation
                        g_iDragWinLeftX = parseInt(g_iDragWinLeftX * (160 / 120));
                        g_iDragWinTopY = parseInt(g_iDragWinTopY * (120 / 160));
                    }
                    else {
                        if (g_iDragWinLeftX > 160) g_iDragWinLeftX = 160;
                        if (g_iDragWinTopY > 120) g_iDragWinTopY = 120;
                    }

                    //console.log("drag stop " + g_iDragWinLeftX + ", " + g_iDragWinTopY + ", " + g_iDragWinWidth + ", " + g_iDragWinHeight);
                    document.getElementById(PLUGIN_ID).SetDigitalZoomEditWindowPos(g_iDragWinLeftX, g_iDragWinTopY, g_iDragWinWidth, g_iDragWinHeight);
                    //console.log(g_iDragWinWidth+ ",  " +g_iDragWinHeight);
                    $("#dz-top").html(g_iDragWinTopY);
                    $("#dz-left").html(g_iDragWinLeftX);
                    $("#dz-width").html(g_iDragWinWidth);
                    $("#dz-height").html(g_iDragWinHeight);
                }
            }).resizable({
                containment: '#dz-plugin',
                handles: 'n, e, s, w, ne, se, sw, nw, all',
                start: function (event, ui) {
                    //g_iDragWinWidth 	= ui.size.width;
                    //g_iDragWinHeight	= ui.size.height;

                    g_iDragWinLeftX = $("#drag-window").position().left;
                    g_iDragWinTopY = $("#drag-window").position().top;
                    g_iDragWinWidth = parseInt($("#drag-window").css("width"), 10);
                    g_iDragWinHeight = parseInt($("#drag-window").css("height"), 10);
                    $("#dz-top").html(g_iDragWinTopY);
                    $("#dz-left").html(g_iDragWinLeftX);
                    $("#dz-width").html(g_iDragWinWidth);
                    $("#dz-height").html(g_iDragWinHeight);
                },
                resize: function (event, ui) {
                    g_iDragWinLeftX = $("#drag-window").position().left;
                    g_iDragWinWidth = parseInt($("#drag-window").css("width"), 10);
                    g_iDragWinTopY = $("#drag-window").position().top;
                    g_iDragWinHeight = parseInt($("#drag-window").css("height"), 10);

                    /*jquery ui hack*/
                    if (g_iDragWinTopY == 0 || g_iDragWinLeftX == 0) {
                        g_iDragWinWidth = g_iDragWinWidth;
                        g_iDragWinHeight = g_iDragWinHeight;
                    }
                    if (videoin_c0_rotate == 90 || videoin_c0_rotate == 270) {
                        if (g_iDragWinLeftX > 120) g_iDragWinLeftX = 120;//rotation
                        if (g_iDragWinTopY > 160) g_iDragWinTopY = 160;//rotation
                        g_iDragWinLeftX = parseInt(g_iDragWinLeftX * (160 / 120));
                        g_iDragWinTopY = parseInt(g_iDragWinTopY * (120 / 160));
                    }
                    else {
                        if (g_iDragWinLeftX > 160) g_iDragWinLeftX = 160;
                        if (g_iDragWinTopY > 120) g_iDragWinTopY = 120;
                    }

                    $("#dz-top").html(g_iDragWinTopY);
                    $("#dz-left").html(g_iDragWinLeftX);
                    $("#dz-width").html(g_iDragWinWidth);
                    $("#dz-height").html(g_iDragWinHeight);

                    /*log*/

                    if (videoin_c0_rotate == 90 || videoin_c0_rotate == 270) {
                        g_iDragWinWidth = parseInt(g_iDragWinWidth * (160 / 120));
                        g_iDragWinHeight = parseInt(g_iDragWinHeight * (120 / 160));
                    }
                    //console.log("resize " + g_iDragWinLeftX + ", " + g_iDragWinTopY + ", " + g_iDragWinWidth + ", " + g_iDragWinHeight);
                    document.getElementById(PLUGIN_ID).SetDigitalZoomEditWindowPos(g_iDragWinLeftX, g_iDragWinTopY, g_iDragWinWidth, g_iDragWinHeight);
                    /*
                    g_iDragWinWidth 	= ui.size.width;
                    g_iDragWinHeight	= ui.size.height;
                    if (g_iDragWinWidth < 160 && g_iDragWinHeight < 120)
                    {
                        document.getElementById(PLUGIN_ID).SetDigitalZoomEditWindowPos(g_iDragWinLeftX, g_iDragWinTopY, g_iDragWinWidth, g_iDragWinHeight);
                    }*/
                },
                stop: function (event, ui) {
                    if (g_iDragWinLeftX < 0) g_iDragWinleftX = 0;
                    if (g_iDragWinTopY < 0) g_iDragWinTopY = 0;
                    if (g_iDragWinLeftX + g_iDragWinWidth > 160) g_iDragWinWidth = 160 - g_iDragWinLeftX;
                    if (g_iDragWinTopY + g_iDragWinHeight > 120) g_iDragWinHeight = 120 - g_iDragWinTopY;

                    $("#dz-top").html(g_iDragWinTopY);
                    $("#dz-left").html(g_iDragWinLeftX);
                    $("#dz-width").html(g_iDragWinWidth);
                    $("#dz-height").html(g_iDragWinHeight);
                    //console.log("resizestop " + g_iDragWinLeftX + ", " + g_iDragWinTopY + ", " + g_iDragWinWidth + ", " + g_iDragWinHeight);
                    //g_iDragWinWidth 	= ui.size.width;
                    //g_iDragWinHeight	= ui.size.height;
                }
            }).css("background-color", "#fff").css("opacity", "0.5");

            document.getElementById(PLUGIN_ID).DigitalZoomEnabled = true;

            if ($("#DZDisable").attr("checked") == false)
                $("#zoom-slider").slider("enable");
            else
                $("#zoom-slider").slider("disable");
        }
    }
    else {
        document.getElementById(PLUGIN_ID).SetDigitalZoomDisplayWindowInfo(0, 0, 0/*, 0, 0*/);
        document.getElementById("zoom-frame").style.display = "none";
    }

    updatePluginState();
    //stop event propagation
    if (event) {
        evt = event;
    }
    else {
        evt = window.event;
    }

    if (window.event) {
        evt.cancelBubble = true;
    }
    else {
        evt.stopPropagation();
    }

    if (bInitZoomFrame == false && bIsButton == true) {
        bInitZoomFrame = true;
    }
}

function WinLessPluginCtrlPalyPauseToggle() {
    var object = document.getElementById("btn_play");
    if (bPlayEnabled) {
        object.style.backgroundPosition = "-84px 0";
        object.title = translator("resume");
        bPlayEnabled = false;
        document.getElementById(PLUGIN_ID).RtspPause();
    }
    else {
        object.style.backgroundPosition = "-56px 0";
        object.title = translator("pause");

        document.getElementById("btn_snapshot").disabled = false;
        document.getElementById("btn_snapshot").style.backgroundPosition = "0px 0px";
        document.getElementById("btn_stop").disabled = false;
        document.getElementById("btn_stop").style.backgroundPosition = "-112px 0px";
        loadRtspCtrlBtnValue();

        bPlayEnabled = true;
        bStopEnabled = false;
        document.getElementById(PLUGIN_ID).RtspPlay();
    }
}

function WinLessPluginCtrlStop() {
    var object = document.getElementById("btn_stop");
    bStopEnabled = true;
    bPlayEnabled = false;
    bRecEnabled = false;
    if (bTalkEnabled) {
        WinLessPluginCtrlToggleTalk();
    }

    document.getElementById("btn_play").title = translator("play");
    X = parseInt(object.style.backgroundPosition.split(" ")[0]).toString(10);
    object.style.backgroundPosition = X + "px " + -84 + "px";

    document.getElementById("btn_snapshot").disabled = true;
    document.getElementById("btn_snapshot").style.backgroundPosition = "0px -84px";
    document.getElementById("btn_zoom").disabled = true;
    document.getElementById("btn_zoom").style.backgroundPosition = "-28px -84px";
    document.getElementById("btn_play").style.backgroundPosition = "-84px 0px";
    document.getElementById("btn_stop").disabled = true;
    document.getElementById("btn_stop").style.backgroundPosition = "-112px -84px";
    document.getElementById("btn_record").disabled = true;
    document.getElementById("btn_record").style.backgroundPosition = "-140px -84px";
    document.getElementById("btn_volume").disabled = true;
    document.getElementById("btn_volume").style.backgroundPosition = "-196px -84px";
    document.getElementById("btn_mute").disabled = true;
    document.getElementById("btn_mute").style.backgroundPosition = "-224px -84px";
    document.getElementById("btn_talk").disabled = true;
    document.getElementById("btn_talk").style.backgroundPosition = "-280px -84px";
    document.getElementById("btn_mic_volume").disabled = true;
    document.getElementById("btn_mic_volume").style.backgroundPosition = "-308px -84px";
    document.getElementById("btn_mic_mute").disabled = true;
    document.getElementById("btn_mic_mute").style.backgroundPosition = "-336px -84px";
    document.getElementById("btn_fullscreen").disabled = true;
    document.getElementById("btn_fullscreen").style.backgroundPosition = "-392px -84px";

    document.getElementById(PLUGIN_ID).RtspStop();
    document.getElementById(PLUGIN_ID).Disconnect();

}

function WinLessPluginCtrlRecordToggle() {
    var object = document.getElementById("btn_record");
    if (bRecEnabled) {
        object.style.backgroundPosition = "-140px 0px";
        bRecEnabled = false;
        object.title = translator("start_mp4_recording");
        document.getElementById(PLUGIN_ID).StopMP4Conversion();
    }
    else {
        object.style.backgroundPosition = "-168px 0px";
        bRecEnabled = true;
        object.title = translator("stop_mp4_recording");
        document.getElementById(PLUGIN_ID).StartMP4Conversion();
    }
}

function ChangeSVCFrameLevel() {
    var val = getCookie("framelevel");
    if (val == "min") {
        val = 0;
    }
    document.getElementById(PLUGIN_ID).SVCTFrameLevel = parseInt(val, 10);
}

function MappingMJPEG_FRC_Prioid(streamsource, FRCLevel) {
    eval("AccessName=network_http_s" + streamsource + "_accessname");
    eval("FrameRate=videoin_c0_s" + streamsource + "_mjpeg_maxframe");

    if (FRCLevel == MJPEGFrameLevelCount)
        return 0;
    else
        return parseInt((1000 / FrameRate) * (MJPEGFrameLevelCount / FRCLevel));
}

function ChangeMJPEGFrameLevel(streamsource) {
    var framelevel = getCookie("framelevel");
    var WinlessObject = document.getElementById(PLUGIN_ID);
    if (framelevel == "min") {
        WinlessObject.SVCTFrameInterval = MJPEGMaxFrameInterval;
    }
    else {
        var frameinterval = MappingMJPEG_FRC_Prioid(streamsource, framelevel);
        if (frameinterval > MJPEGMaxFrameInterval) {
            frameinterval = MJPEGMaxFrameInterval
        }
        WinlessObject.SVCTFrameInterval = frameinterval;
    }
}

function switchStreamFrameLevel() {
    streamsource = getCookie("streamsource");
    eval("codectype=videoin_c0_s" + streamsource + "_codectype");

    // When frame level changes, SVCTFrameLevel should be set, but SVCTFrameInterval needn't because it depends on individual stream
    ChangeSVCFrameLevel();
    if (codectype == "mjpeg") {
        ChangeMJPEGFrameLevel(streamsource);
    }
}

function ModifyFrameLevelCookie(val) {
    setCookie("framelevel", val);
}

function OnFrameLevelSelect(val) {
    ModifyFrameLevelCookie(val);
    switchStreamFrameLevel();
}

//volume
function WinLessPluginCtrlVolEdit(event, bool) {
    var evt;

    document.getElementById(PLUGIN_ID).SetDigitalZoomDisplayWindowInfo(0, 0, 0/*, 0, 0*/);
    $("#zoom-frame").hide();
    $("#micvolume-frame").hide();
    bVolumeEnabled = bool;
    if (bVolumeEnabled) {
        document.getElementById("volume-frame").style.display = "block";
        $("#volume-slider").slider({
            value: volumeClient,
            min: 0,
            max: 100,
            step: 5,
            animate: true,
            range: "min",
            slide: function (event, ui) {
                document.getElementById(PLUGIN_ID).PlayVolume = ui.value;
                document.getElementById("volume-amount").innerHTML = ui.value;
            },
            stop: function (event, ui) {
                volumeClient = document.getElementById(PLUGIN_ID).PlayVolume;
                setCookie("strVolumeClient", volumeClient);
            }
        }).children("a").attr("hideFocus", true);

        document.getElementById("volume-amount").innerHTML = $("#volume-slider").slider("value");
        document.getElementById(PLUGIN_ID).PlayVolume = $("#volume-slider").slider("value");
    }
    else {
        $("#volume-frame").hide();
    }

    updatePluginState();
    //stop the event propagation
    if (event) {
        evt = event;
    }
    else {
        evt = window.event;
    }
    if (window.event) {
        evt.cancelBubble = true;
    }
    else {
        evt.stopPropagation();
    }
}

function WinLessPluginCtrlMuteToggle() {
    var object = document.getElementById("btn_mute");
    if (bMuteEnabled) {
        object.style.backgroundPosition = "-252px 0";
        bMuteEnabled = document.getElementById(PLUGIN_ID).PlayMute = false;
        object.title = translator("mute");
        document.getElementById("btn_volume").disabled = false;
        document.getElementById("btn_volume").style.backgroundPosition = "-196px 0px";
    }
    else {
        object.style.backgroundPosition = "-224px 0";
        bMuteEnabled = document.getElementById(PLUGIN_ID).PlayMute = true;
        object.title = translator("audio_on");
        document.getElementById("btn_volume").disabled = true;
        document.getElementById("btn_volume").style.backgroundPosition = "-196px -84px";

    }
}

function WinLessPluginCtrlToggleTalk() {
    var object = document.getElementById("btn_talk");

    if (bTalkEnabled) {
        object.style.backgroundPosition = "-280px 0px";
        bTalkEnabled = false;
        object.title = translator("talk");

        document.getElementById(PLUGIN_ID).StopMicTalk();

        //not 'video only' and stream Contains Audio and is under half-duplex mode
        if (document.getElementById(PLUGIN_ID).GetSettings(0) != "2" && bContainAudio == true && getDuplexMode() == EDuplexMode.half) {

            if (bMuteEnabled)  //when u switch between enable/disable Talk, MuteEnabled should maiatain MuteEnabled state
            {
                document.getElementById("btn_mute").style.backgroundPosition = "-224px 0px";
                document.getElementById("btn_mute").disabled = false;
            }
            else  //when u switch between enable/disable Talk, btn_mute & btn_volume btn should be both enabled/disabled
            {
                bMuteEnabled = !false; // set NOT(inverse value) in order to make toggle true
                WinLessPluginCtrlMuteToggle();
                document.getElementById("btn_mute").disabled = false;
            }
        }
    }
    else {
        object.style.backgroundPosition = "-280px -56px";
        bTalkEnabled = true;
        object.title = translator("stop_talk");

        //document.getElementById(PLUGIN_ID).TalkWithVideoServerMap = (0x1 << 0);

        document.getElementById(PLUGIN_ID).StartMicTalk();
        if (getDuplexMode() == EDuplexMode.half) {
            document.getElementById(PLUGIN_ID).PlayMute = true;
        }
    }
}


//mic volume
function WinLessPluginCtrlMicVolEdit(event, bool) {
    var evt;

    //document.getElementById(PLUGIN_ID).SetDigitalZoomDisplayWindowInfo(0, 0, 0, 0, 0);
    document.getElementById("zoom-frame").style.display = "none";
    document.getElementById("volume-frame").style.display = "none";
    bMicVolumeEnabled = bool;
    if (bMicVolumeEnabled) {
        document.getElementById("micvolume-frame").style.display = "block";
        $(function () {
            $("#micvolume-slider").slider({
                value: micVolumeClient,
                min: 0,
                max: 100,
                step: 5,
                animate: true,
                range: "min",
                slide: function (event, ui) {
                    document.getElementById(PLUGIN_ID).MicVolume = parseInt(ui.value);
                    document.getElementById("micvolume-amount").innerHTML = ui.value;
                },
                stop: function (event, ui) {
                    micVolumeClient = document.getElementById(PLUGIN_ID).MicVolume;
                    setCookie("strMicVolumeClient", micVolumeClient);
                }
            }).children("a").attr("hideFocus", true);
            $("#micvolume-amount")[0].innerHTML = $("#micvolume-slider").slider("value");
            document.getElementById(PLUGIN_ID).MicVolume = parseInt($("#micvolume-slider").slider("value"));
        });
    }
    else {
        $("#micvolume-frame").hide();
    }

    updatePluginState();

    if (event) {
        evt = event;
    }
    else {
        evt = window.event;
    }
    if (window.event) {
        evt.cancelBubble = true;
    }
    else {
        evt.stopPropagation();
    }
}

function WinLessPluginCtrlToggleMicMute() {
    var object = document.getElementById("btn_mic_mute");
    if (bMicMuteEnabled) {
        object.style.backgroundPosition = "-364px 0px";
        bMicMuteEnabled = false;
        //obj.title = translator("disable_mute");
        object.title = translator("mute");
        document.getElementById(PLUGIN_ID).EnableMuteWhenTalk = bMicMuteEnabled;
        document.getElementById(PLUGIN_ID).MicMute = bMicMuteEnabled;
        document.getElementById("btn_mic_volume").disabled = false;
        document.getElementById("btn_mic_volume").style.backgroundPosition = "-308px 0px";
    }
    else {
        object.style.backgroundPosition = "-336px 0px";
        bMicMuteEnabled = true;
        //obj.title = translator("enable_mute");
        object.title = translator("mic_on");
        document.getElementById(PLUGIN_ID).MicMute = bMicMuteEnabled;
        document.getElementById("btn_mic_volume").disabled = true;
        document.getElementById("btn_mic_volume").style.backgroundPosition = "-308px -84px";
    }
}


function WinLessPluginCtrlFS() {
    alert("test");
    document.getElementById(PLUGIN_ID).SetFullScreen(true);
}

function resizePlugin() {
    $.ajax({
        url: "/cgi-bin/viewer/getparam.cgi?videoin_c0_s0_resolution&videoin_c0_s1_resolution",
        async: false,
        success: function (data) { eval(data); }
    });

    //eval("VideoSize=videoin_c0_s" + $("#WinLessPluginCtrl").attr("ViewStream") + "_resolution");
    evalPluginSize();

    //WinLessPluginCtrlObject.Stretch = "false";
    //WinLessPluginCtrlObject.width = W + X_OFFSET;
    //WinLessPluginCtrlObject.height = H + Y_OFFSET;
    //loadRtspCtrlBtnValue();
}

// update
/* 20110103 ken: Note the pluginId is only for VS8X01, it is not work for other model*/
function UpdateTalkStatus(pluginId, param1, param2) {
    // 1:talking, 2:eNonTalking
    if (param1 == 1) {
        //	alert("talking");
        if (bTalkEnabled && getDuplexMode() == EDuplexMode.half) {
            //WinLessBtnToggler('disable', 'btn_broadcast', 'btn_volume', 'btn_mute');
            $("#btn_volume").attr("disabled", true);
            $("#btn_volume").css("backgroundPosition", "-196px -84px");
            $("#btn_volume").attr('title', translator("volume"));

            $("#btn_mute").attr("disabled", true);
            $("#btn_mute").css("backgroundPosition", "-224px -84px");
            $("#btn_mute").attr('title', translator("mute"));
        }
    }
    else if (param1 == 5) {
        //alert("eNonTalking");
        //bTalkEnabled = true;
        //WinLessPluginCtrlToggleTalk();
        if (bPNOTIFY) {
            var avMLLangStr = translator("the_upstream_channel_is_occupied_please_try_later");
            $.pnotify({
                pnotify_title: 'Stream ' + eval(document.getElementById(PLUGIN_ID).ViewStream + 1),
                pnotify_text: avMLLangStr,
                pnotify_notice_icon: 'ui-icon ui-icon-video',
                pnotify_opacity: .8,
                pnotify_type: 'error',
                pnotify_addclass: "stack-bottomright",
                pnotify_history: false,
                pnotify_stack: stack_bottomright
            });
        }

        //WinLessBtnToggler('enable', 'btn_talk', 'btn_broadcast');
        $("#btn_talk").attr("disabled", false);
        $("#btn_talk").css("backgroundPosition", "-280px 0px");
        $("#btn_talk").attr('title', translator("talk"));

        bTalkEnabled = false;
        //bBroadcastEnabled = false;
    }
    else if (param1 == 4) {
        if (bStopEnabled) {
            //WinLessBtnToggler('disable', 'btn_talk', 'btn_broadcast');
            $("#btn_talk").attr("disabled", true);
            $("#btn_talk").css("backgroundPosition", "-280px -84px");
            $("#btn_talk").attr('title', translator("talk"));
        }
        else {
            //WinLessBtnToggler('enable', 'btn_talk', 'btn_broadcast');
            $("#btn_talk").attr("disabled", false);
            $("#btn_talk").css("backgroundPosition", "-280px 0px");
            $("#btn_talk").attr('title', translator("talk"));
            /*
			//WinLessBtnToggler('disable', 'btn_broadcast', 'btn_volume', 'btn_mute');
			$("#btn_volume").attr("disabled", false);
			$("#btn_volume").css("backgroundPosition", "-196px 0px");
			$("#btn_volume").attr('title', translator("volume"));
			
			$("#btn_mute").attr("disabled", false);
			$("#btn_mute").css("backgroundPosition", "-224px 0px");
			$("#btn_mute").attr('title', translator("mute"));
			*/
        }

        bTalkEnabled = false;
        //bBroadcastEnabled = false;
    }
}

function UpdateVideoCodec(pluginId, param1, param2) {
    // 1:MJpeg, 2:MP4
    switch (param1) {
        case 1:
            //alert("Motion Jpeg")
            codectype = "mjpeg";
            //	Mpeg4_MJpeg_Switch();
            break;
        case 2:
            //alert("Mpeg4");
            codectype = "mpeg4";
            //	Mpeg4_MJpeg_Switch();
            break;
        case 3:
            //alert("H.264");
            codectype = "h264";
            //	Mpeg4_MJpeg_Switch();
            break;
        default:
            //alert(param1)
            break;
    }
}

function UpdateConnectionStatus(pluginId, param1, param2) {
    clientOptValueBin = document.getElementById(PLUGIN_ID).ClientOptions.toString(2);
    //console.log("clientOptValueBin=" + clientOptValueBin);

    if (param1 == 1) // Success
    {
        if (param2 == 1) // Video
        {
            bContainVideo = true;
            bContainAudio = false;
            resizePlugin();
            if (bPNOTIFY && document.getElementById(PLUGIN_ID).GetSettings(0) != 2 && !(clientOptValueBin.charAt(4) == 0 && clientOptValueBin.charAt(6) == 0)) {
                var avMLLangStr = translator("the_media_type_has_been_changed_to_video_only_because_the_media_from_server_contains_no_audio");
                $.pnotify({
                    pnotify_title: 'Stream ' + eval(document.getElementById(PLUGIN_ID).ViewStream + 1),
                    pnotify_text: avMLLangStr,
                    pnotify_notice_icon: 'ui-icon ui-icon-video',
                    pnotify_opacity: .8,
                    pnotify_addclass: "stack-bottomright",
                    pnotify_history: false,
                    pnotify_stack: stack_bottomright
                });
            }
            //}
        }
        else if (param2 == 2) // Audio
        {
            bContainVideo = false;
            bContainAudio = true;
            if (false) {
                $.pnotify({
                    pnotify_title: 'Connection Done',
                    pnotify_text: 'Channel ' + document.getElementById(PLUGIN_ID).ViewChannel + ' contains audio only.',
                    pnotify_notice_icon: 'ui-icon ui-icon-volume-on',
                    pnotify_opacity: .8,
                    pnotify_addclass: "stack-bottomright",
                    pnotify_history: false,
                    pnotify_stack: stack_bottomright
                });
            }
        }
        else if (param2 == 3) // Audio and video
        {
            bContainAudio = true;
            bContainVideo = true;
            resizePlugin();
        }

        loadRtspCtrlBtnValue();
    }
    else if (param1 == 2) // Stop
    {
        //	WinLessPluginCtrlStop();
    }
    else if (param1 == 3) // Failed
    {
        if (bPNOTIFY) {
            avMLLangStr = translator("connect_failed");
            $.pnotify({
                pnotify_title: 'Stream ' + eval(document.getElementById(PLUGIN_ID).ViewStream + 1),
                pnotify_text: avMLLangStr,
                pnotify_type: 'error',
                pnotify_error_icon: 'ui-icon ui-icon-alert',
                pnotify_opacity: .8,
                pnotify_addclass: "stack-bottomright",
                pnotify_history: false,
                pnotify_stack: stack_bottomright
            });
        }
    }
    else if (param1 == 4) // Exceed
    {
        if (bPNOTIFY) {
            var avMLLangStr = translator("connections_already_exceed_the_limit");
            $.pnotify({
                pnotify_title: 'Stream ' + eval(document.getElementById(PLUGIN_ID).ViewStream + 1),
                pnotify_text: avMLLangStr,
                pnotify_type: 'error',
                pnotify_error_icon: 'ui-icon ui-icon-power',
                pnotify_opacity: .8,
                pnotify_addclass: "stack-bottomright",
                pnotify_history: false,
                pnotify_stack: stack_bottomright
            });
        }
    }

    $("#StreamSelector").attr("disabled", false);
}

function UpdateMP4Status(pluginId, param1, param2) {
    //alert("UpdateMP4Status:"+param1+", "+param2);
    // 0:eAVINone, 1:eAVIStop, 2:eAVIRecord
    if (param1 == 0) {
        //alert("eAVINone");
    }
    else if (param1 == 1) {
        bRecEnabled = false;
        //WinLessPluginCtrlRecordToggle();
        //logBlock.innerHTML += "Stop Record, ";
    }
    else if (param1 == 2) {
        bRecEnabled = true;
        //document.getElementById().AutoReStartMP4Recording = true;
        //WinLessPluginCtrlRecordToggle();
        //logBlock.innerHTML += "Start Record, ";				

    }


    var channels = "";
    if (bRecEnabled == true) {
        channels = 0;
    }
    /*
        if (channels)
        {
            $.pnotify_remove_all();
            recordingPN = $.pnotify({
                pnotify_title: 'Recording..',
                pnotify_text: 'Channel '+channels+' is recording..',
                pnotify_notice_icon: 'picon picon-recording',
                pnotify_opacity: .8,
                pnotify_addclass: "stack-bottomright",
                pnotify_nonblock: true,
                pnotify_hide: false,
                pnotify_closer: false,
                pnotify_history: false,
                pnotify_stack: stack_bottomright
            });
        }
        else
        {
            recordingPN.pnotify_remove();
        }
        */
}

function UpdateRtspStatus(pluginId, param1, param2) {
    //alert("UpdateRtspStatus: "+param1+", "+param2);
    // 0:eRtspStateNone, 1:eRtspStatePlayBefore, 2:eRtspStatePlay, 3:eRtspStatePause
    if (codectype == "mpeg4" || codectype == "h264") {
        if (param1 == 0) {
            //logBlock.innerHTML += "rtsp stop, ";
            //bStopEnabled = false;
            //WinLessPluginCtrlStop();			
        }
        else if (param1 == 1) {
            //logBlock.innerHTML += "rtsp before play, ";
        }
        else if (param1 == 2) {
            //bPlayEnabled = false;
            //logBlock.innerHTML += "rtsp play, ";
            //WinLessPluginCtrlPalyPauseToggle();
        }
        else if (param1 == 3) {
            //bPlayEnabled = true;
            //logBlock.innerHTML += "rtsp pause, ";
            //WinLessPluginCtrlPalyPauseToggle();
        }
    }
}

function UpdateDOChange(pluginId, param1, param2) {
    //alert("UpdateDOChange:"+param1+", "+param2);
    // 0:failed, 1:success	
    if (param1 == true) {
        //logBlock.innerHTML += "Change DO success, ";
        $.getScript("/cgi-bin/admin/getparam.cgi?status_do_i0", function () {
            DOButtonStatusUpdate(true);
        });
    }
    else {
        //logBlock.innerHTML += "Change DO failed, ";
        DOButtonStatusUpdate();
    }
}

function UpdateProtocolStatus(pluginId, param1, param2) {
    if (param1 == 2) {
        var avMLLangStr = "";
        switch (param2) {
            case 1:
                avMLLangStr = translator("because_the_network_environment_problem_transmission_mode_changes_to_unicast");
                break;
            case 2:
                avMLLangStr = translator("because_the_network_environment_problem_transmission_protocol_changes_to_tcp");
                break;
            case 3:
                avMLLangStr = "Because the connection problem of network environment,\ntransmission protocol changes to HTTP.";
                break;
            case 4:
                avMLLangStr = "Because the connection problem of network environment,\ntransmission protocol changes to Multicast (UDP).";
                break;
        }

        if (bPNOTIFY) {
            $.pnotify({
                pnotify_title: 'Stream ' + eval(document.getElementById(PLUGIN_ID).ViewStream + 1),
                pnotify_text: avMLLangStr,
                pnotify_notice_icon: 'ui-icon ui-icon-signal',
                pnotify_opacity: .8,
                pnotify_addclass: "stack-bottomright",
                pnotify_history: false,
                pnotify_stack: stack_bottomright
            });
        }
    }

}

function UpdateZoomFactor(pluginId, pStrSendCmd) {
    if (bROI_Initialed) {
        // For all plugin behavior
        g_bRefreshROI = true; // set this to avoid sent cgi cmd once executing refreshROI
        setTimeout('updateStatus("all")', 500);
    }
    else {
        // ONLY for zoom
        if (pStrSendCmd.match(/zoom=/) != null)
            setTimeout('updateStatus("zoom")', 500);
    }
}

function UpdateJoyStickStatus(PluginId, btnIdx, actIdx, bPress) {
    if (btnIdx > 12) // to prevent error code returned by joystick
    {
        return;
    };
    var channelsource = 0;
    var RegJoystickActBtnMap = WinLessPluginCtrlObject.GetSettings(parseInt(5));
    var ActBtnMapArr = RegJoystickActBtnMap.split('');

    for (ActIndex in ActBtnMapArr) {
        if (parseInt(ActBtnMapArr[ActIndex], 16) == btnIdx) {
            actIdx = ActIndex;
            break;
        }
    }

    switch (parseInt(actIdx)) {
        case -1: //error
            break
        case 0://Toggle play/pause
            WinLessPluginCtrlPalyPauseToggle();
            break;
        case 1://Stop streaming
            if (bTalkEnabled)
                document.getElementById(PLUGIN_ID).StopMicTalk();
            WinLessPluginCtrlStop();
            break;
        case 2://Snapshot
            clientsidesnapshot("/cgi-bin/viewer/video.jpg");
            break;
        case 3://Fullscreen
            WinLessPluginCtrlFS();
            break;
        case 4: //Start/stop recording
            WinLessPluginCtrlRecordToggle();
            break;
        case 5://Pan
            CamControl('auto', 'pan');
            break;
        case 6://Patrol
            CamControl('auto', 'patrol');
            break;
        case 7://Stop
            CamControl('auto', 'stop');
            break;
        case 8://Zoom in
            CamControl('zoom', 'tele');
            break;
        case 9://Zoom out
            CamControl('zoom', 'wide');
            break;
        case 10://Digital output 1 on/off
        case 11://Digital output 2 on/off
        case 12://Digital output 3 on/off
        case 13://Digital output 4 on/off

            var XMLHttpRequestObject = false;
            if (window.XMLHttpRequest)
                XMLHttpRequestObject = new XMLHttpRequest();
            else if (window.ActiveXObject)
                XMLHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP");

            var doNum = parseInt(actIdx - 10);
            var doCGICmd = '/cgi-bin/dido/getdo.cgi?do' + doNum;

            //XMLHttpRequestObject.open("GET", "/cgi-bin/dido/getdo.cgi?do0", false);
            XMLHttpRequestObject.open("GET", doCGICmd, false);
            XMLHttpRequestObject.setRequestHeader("If-Modified-Since", "0");
            XMLHttpRequestObject.send(null);
            eval(XMLHttpRequestObject.responseText);
            if (XMLHttpRequestObject.responseText.match('do' + doNum + '=0')) {
                retframe.location.href = '/cgi-bin/dido/setdo.cgi?do' + doNum + '=1';
                DOButtonStatusUpdate(false, doNum);
            }
            else if (XMLHttpRequestObject.responseText.match('do' + doNum + '=1')) {
                retframe.location.href = '/cgi-bin/dido/setdo.cgi?do' + doNum + '=0';
                DOButtonStatusUpdate(false, doNum);
            }

            break;
        case 14://Manual triggers 1 on/off
        case 15://Manual triggers 2 on/off
        case 16://Manual triggers 3 on/off
        case 17://Manual triggers 4 on/off

            var XMLHttpRequestObject = false;
            if (window.XMLHttpRequest)
                XMLHttpRequestObject = new XMLHttpRequest();
            else if (window.ActiveXObject)
                XMLHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP");

            var viNum = parseInt(actIdx - 14);
            VIButtonStatusUpdate(false, viNum);

            break;
        default:
            if (streamsource >= FULLVIEW_STREAM_INDEX)
                break;
            var preset_name;
            var preset_index = eval(actIdx - 21);
            eval("preset_name=eptz_c0_s" + streamsource + "_preset_i" + preset_index + "_name");
            if (getCookie("activatedmode") == "mechanical") {
                var CGICmd = '/cgi-bin/camctrl/recall.cgi?channel=' + channelsource + '&index=' + parseInt(actIdx - 21);//$(selObj).selectedOptions().val();
            }
            else {
                //				var CGICmd='/cgi-bin/camctrl/eRecall.cgi?channel=' + channelsource + '&stream=' + streamsource + '&recall=' + encodeURIComponent($(selObj).selectedOptions().text());
                //				var CGICmd='/cgi-bin/camctrl/eRecall.cgi?channel=' + channelsource + '&stream=' + streamsource + '&recall=' + document.getElementById("presetname").options[actIdx-18+1].text();i
                var CGICmd = '/cgi-bin/camctrl/eRecall.cgi?channel=' + channelsource + '&stream=' + streamsource + '&recall=' + encodeURIComponent(preset_name);
            }
            parent.retframe.location.href = CGICmd;
            Log("Send: %s", CGICmd);
            break;
    }

}

function initWinLessPluginCallbackFn() {
    var PluginObj = document.getElementById(PLUGIN_ID);

    //deWinLessPluginCallbackFn();

    addPluginEvent(PluginObj, "TalkStatus", UpdateTalkStatus);
    //	addPluginEvent(PluginObj, "VideoCodec", UpdateVideoCodec);	
    addPluginEvent(PluginObj, "ConnectionStatus", UpdateConnectionStatus);
    addPluginEvent(PluginObj, "MP4Status", UpdateMP4Status);
    addPluginEvent(PluginObj, "ProtocolStatus", UpdateProtocolStatus);
    addPluginEvent(PluginObj, "VNDPWrapperReady", WinLessReady);

    addPluginEvent(PluginObj, "EPTZSend", UpdateZoomFactor);
    //addPluginEvent(PluginObj, "RtspStatus", UpdateRtspStatus);	
    //addPluginEvent(PluginObj, "DOChange", UpdateDOChange);
    addPluginEvent(PluginObj, "JoystickBtnTrigger", UpdateJoyStickStatus);
}


function deWinLessPluginCallbackFn() {
    var PluginObj = document.getElementById(PLUGIN_ID);

    removePluginEvent(PluginObj, "TalkStatus", UpdateTalkStatus);
    //	removePluginEvent(PluginObj, "VideoCodec", UpdateVideoCodec);	
    removePluginEvent(PluginObj, "ConnectionStatus", UpdateConnectionStatus);
    removePluginEvent(PluginObj, "MP4Status", UpdateMP4Status);
    removePluginEvent(PluginObj, "ProtocolStatus", UpdateProtocolStatus);

    removePluginEvent(PluginObj, "VNDPWrapperReady", WinLessReady);
    removePluginEvent(PluginObj, "EPTZSend", UpdateZoomFactor);
    removePluginEvent(PluginObj, "JoystickBtnTrigger", UpdateJoyStickInfo);
}


function initPluginCallbackFn() {

    /*@cc_on
     @if (@_jscript_version >= 5)
     //alert("OS is 32-bit. Browser is IE.");
     //$('body').append('<div id = "log"></br> Log : </br></div>');
     //var logBlock = document.getElementById("log");

     function WinLessPluginCtrl::OnProtocolRolling(param)
     {
         if (param == 1)
         {
             //alert("UDP");
         }
         else if (param == 2)
         {
             //alert("UDP");
         }
         else if (param == 3)
         {
             //alert("HTTP");
         }
         else if (param == 4)
         {
             //alert("Multicast");
         }
     }

     function WinLessPluginCtrl::OnTalkStatus(param)
     { // 1:talking, 2:eNonTalking
         if (param == 1)
         {
             //alert("talking");
         }
         else
         {
             //alert("eNonTalking");
             bTalkEnabled = true;
             WinLessPluginCtrlToggleTalk();
         }
     }

     function WinLessPluginCtrl::OnVideoCodec(param)
     { // 1:MJpeg, 2:MP4
         switch(param)
         {
         case 1:
             //alert("Motion Jpeg")
             codectype = "mjpeg";
             Mpeg4_MJpeg_Switch();
             break;
         case 2:
             //alert("Mpeg4");
             codectype = "mpeg4";
             Mpeg4_MJpeg_Switch();
             break;
         case 4:
             codectype = "h264";
             Mpeg4_MJpeg_Switch();
             break;
         default:
             //alert("OnVideoCodec else")
             break;
         }
     }

     //Kent 20081124, cause plugin callback param = 2 ealier than param = 1, 
     //so that if param == 2 is true, statement "bContainAudio = false" won't exec when param == 1
     function WinLessPluginCtrl::OnConnectionOK(param)
     { // 1:means streaming contains video, 2:means streaming contains audio
         //alert(v1);
         bContainAudio = false; //Kent, set init value = false, means contains no audio.
         if (param == 1)
         {
             //alert('streaming contains video');
             bContainVideo = true;
             resizePlugin();
         }
         else if (param == 2)
         {
             //alert('streaming contains audio')
             bContainAudio = true;
             //logBlock.innerHTML += "</br>streaming contains audio</br> ";
         }
         $("#StreamSelector").attr("disabled", false);
     }

     function WinLessPluginCtrl::OnConnectionBroken(param)
     {	
         if (param == 1) // means streaming contains video
         {
             //alert('OnConnectionBroken: streaming contains video');
             //ControlForm.chkVideo.checked = false;
         }
         else if (param == 2) // means streaming contains audio
         {
             //alert('OnConnectionBroken: streaming contains audio');    	
             //ControlForm.chkAudio.checked = false;    	
         }
     }    

     function WinLessPluginCtrl::OnMP4Status(param)
     { // 0:eAVINone, 1:eAVIStop, 2:eAVIRecord
         if (param == 0)
         {
             //alert("eAVINone");
         }				
         else if (param == 1)
         {
             bRecEnabled = true;
             WinLessPluginCtrlRecordToggle();
             //logBlock.innerHTML += "Stop Record, ";
         }				
         else if (param == 2)
         {
             bRecEnabled = false;
             WinLessPluginCtrl.AutoReStartMP4Recording = true;
             WinLessPluginCtrlRecordToggle();
             //logBlock.innerHTML += "Start Record, ";				
         }				
     }


     function WinLessPluginCtrl::OnRtspStatus(param)
     {// 0:eRtspStateNone, 1:eRtspStatePlayBefore, 2:eRtspStatePlay, 3:eRtspStatePause

         if (codectype == "mpeg4"  || codectype == "h264")
         {
             if (param == 0)
             {
                 //logBlock.innerHTML += "rtsp stop, ";
                 bStopEnabled = false;
                 WinLessPluginCtrlStop();			
             }				
             else if (param == 1)
             {
                 //logBlock.innerHTML += "rtsp before play, ";
             }
             else if (param == 2)
             {
                 bPlayEnabled = false;
                 //logBlock.innerHTML += "rtsp play, ";
                 WinLessPluginCtrlPalyPauseToggle();
             }				
             else if (param == 3)
             {
                 bPlayEnabled = true;
                 //logBlock.innerHTML += "rtsp pause, ";
                 WinLessPluginCtrlPalyPauseToggle();
             }
         }
     };

     function WinLessPluginCtrl::OnDOChange(param)
     { // 0:failed, 1:success	
         if (param == true)
         {
             //logBlock.innerHTML += "Change DO success, ";
             $.getScript("/cgi-bin/admin/getparam.cgi?status_do_i0",function(){
             DOButtonStatusUpdate(true);
         });
     }
     else
     {
         //logBlock.innerHTML += "Change DO failed, ";
         DOButtonStatusUpdate();				
     }

    function RtspVapgCtrl::OnMDAlert(pvAlertArrayData)
    {
        var i, vArray;
        alert(pvAlertArrayData);

        // note: the array in javascript is a flat one, not in two dimemsions.
        // so the [i][0] is in [i], and [i][1] is in [i + 3] since there are three elements
        // in the first index
    }
 };
 @end
 @*/

}

