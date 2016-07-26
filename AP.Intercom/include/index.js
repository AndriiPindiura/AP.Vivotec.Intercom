var ShowCamCtrl = true;
var HasCamCtrlPrivilege = true;
var HasDoPrivilege = true;
var HasManualTriggerPrivilege = true;
var ShowFocusAssist = false;

var bPNOTIFY = true;
var stack_bottomright = { "dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15 };
var volumeClient = 50;
var micVolumeClient = 50;

var FrameControlType = 0; //0:none ; 1:mjpeg; 2:SVC-T

$.Installer = {
    plugins: {
        mime: "application/x-installermgt",
        description: FF_XPI_DESCRIPTION
    }
};
// Add xpi, in order to dynamically set JSON name of FF_XPI_DESCRIPTION
$.Installer.plugins.xpi = {};
$.Installer.plugins.xpi[FF_XPI_DESCRIPTION] = "/npVivotekInstallerMgt.xpi";
function pluginCreated() {
    if (document.getElementById(PLUGIN_ID).PluginBeCreated != true) {
        setTimeout('pluginCreated()', 100);
    }
    else {
        initWinLessPluginCallbackFn();
        if (HasCamCtrlPrivilege == true) {
            initPTZPanel();
        }
        else {
            $('#ptz_select_panel').hide();
        }

        if (HasDoPrivilege == false) {
            $('#digital_output').hide();
        }

        try {
            if (bIsWinMSIE || bIsFireFox || bIsChrome) {
                if ((streamsource < FULLVIEW_STREAM_INDEX) && (HasCamCtrlPrivilege == true)) {
                    updateStatus("zoom");
                }
                else {
                    $('#ptz_select_panel').hide();
                }
            }
            else {
                Mpeg4_MJpeg_Switch();
                $("#viewsizeCtrlBlk").css("visibility", "hidden");
                $("#RtspCtrlBtn-bar").hide();
            }
        }
        catch (err) {
            Log(err.description);
        }

        //Init viewsizemode button state.
        if (bIsWinMSIE) {
            var viewsizemode = getCookie("viewsizemode");
            if (0 != viewsizemode) {
                switchView($("button.viewstyle:[title*='" + viewsizemode + "']")[0], viewsizemode, true);
            }
            else {
                setCookie("viewsizemode", "100");
                switchView($("button.viewstyle:[title*='100%']")[0], "100", true);
            }
        }
        else {
            // In no-IE browser, there's no view-size mode button.
            // So it will be always "100%" view-size mode.
            setCookie("viewsizemode", "100");
            switchView($("button.viewstyle:[title*='100%']")[0], "100", true);
        }

        //set cookie "4x3" default value = false;
        if (0 == getCookie("4x3")) {
            setCookie("4x3", "false");
        }
        else if ("true" == getCookie("4x3")) {
            setCookie("4x3", "false");
            Toggle4x3();
        }

        //piris
        /*
		   if (capability_image_iristype == "piris")
		   {
		   if ("manual" == videoin_c0_piris_mode && ((privilege == 0) || (privilege >= 4)))
		   {
		   $("#tbl_piris_adjustment").show();
		   $("#slider_sensitivity").slider({
		min: 1,
		max: 100,
		animate: true,
		range: "min",
		slide: function(event, ui)
		{
		},
		change: function(event, ui)
		{
		$.get("/cgi-bin/operator/setparam.cgi?videoin_c0_piris_position=" + ui.value);
		$("div.ui-slider-handle").attr("title", ui.value);
		}							
		});
		$("#slider_sensitivity").slider("option", "value", videoin_c0_piris_position);
		$("div.ui-slider-handle").attr("title", videoin_c0_piris_position);
		}
		}
		 */

        // Focus Assist OSD privilege in root
        if ((privilege == 0) || (privilege == 6)) {
            $('#focus_assist').show();
        }

        // Focus Assist disable when close window
        $(window).unload(function () {
            if (ShowFocusAssist == true) {
                BackToOriginalStream();
                $.get('/cgi-bin/admin/setFA_off.cgi');
            }
        });
    }

}


function loadCurrentSetting() {
    var version = function (name) {
        var pos = name.search(" v");
        if (pos == -1) {
            return [];
        }
        return name.substr(pos + 2).split(".");
    };

    var compare = function (cur, src) {
        var cur = version(cur);
        var src = version(src);
        for (var i = 0; i < 4; ++i) {
            if (src[i] > cur[i]) {
                return true;
            } else if (src[i] < cur[i]) {
                return false;
            }
        }
    };
    /*	
        //updata 
        if (navigator.userAgent.match("Firefox") != null)
        {
            var xpi = undefined;
                
            var plugin = $.Installer.plugins;
            var type = window.navigator.mimeTypes[plugin.mime];
            
            if(!type || compare(type.description, plugin.description)) {
                xpi = plugin.xpi;
            }
        
            if(xpi) {
                window.InstallTrigger.install(xpi);
            }
        }
        else if (bIsChrome)
        {
            var crx = undefined;
            var plugin = $.Installer.plugins;
            var type = window.navigator.mimeTypes[plugin.mime];
    
            if(!type || compare(type.description, plugin.description)) {
                // update chrome extension : crx
                $("#InstallerArea").append('<iframe width="1" height="1" frameborder="0" src="/npVivotekInstallerMgt.crx"></iframe>');
            }
        }
        
        if (bIsFireFox || bIsChrome)
        {
            $('#InstallerArea').html('<object id="Installer" type="application/x-installermgt"></object>');
            $('#Installer').attr("InstallerPath", window.location.protocol + "//" + window.location.hostname + "/VVTK_Plugin_Installer.exe");
        }
    */
    $('#InstallerArea').hide();

    resizeLogo();
    $("#sidebar-footer").corners("10px bottom-right");
    $("#control-area").corners("10px top-right");
    $("#video-area-wrapper").corners("10px");
    $('.rounded_frame, .rounded_outter').corners();

    StreamIndex = document.getElementById("StreamSelector").value = getCookie("streamsource");

    loadvalue_MultiLangList();
    $(".digitalOutPut-bar").css("overflow", "visible"); // buggy IE? still don't know why
    document.title = system_hostname;
    $("#page_title").html("<span></span>" + system_hostname);

    SpecicalCaseHandle();

    loadlanguage();
    loadvalue();

    CheckPrivilege();
    initButton();
    VIButtonStatusUpdate(true, 0);
    VIButtonStatusUpdate(true, 1);
    VIButtonStatusUpdate(true, 2);

    // Update FA button
    FAButtonStatusUpdate('0');

    if (capability_nuart == "1") //For camera with mechanical ptz
    {
        CheckCamCtrl();
    }

    if (HasDoPrivilege == true) {
        GenerateDOList();
        for (iDO = 0; iDO < parseInt(capability_ndo, 10) ; iDO++) {
            DOButtonStatusUpdate(true, iDO);
        }
    }

    if (document.all)  //for buggy IE6
        document.execCommand("BackgroundImageCache", false, true);

    $("#btn_ptz_zoomWide").html("&nbsp;");
    $("#btn_ptz_zoomTele").html("&nbsp;");
    if (bIsWinMSIE) {
        $("#btn_ptz_zoomWide").css("margin-right", "-2px");
        $("#btn_ptz_zoom_text").text(translator("zoom")).css("padding-left", $("#btn_ptz_zoom").width() / 2 - $("#btn_ptz_zoom_text").width() / 2 + "px");
    }
    else {
        $("#btn_ptz_zoom").text(translator("zoom"));
    }

    $("#btn_ptz_focusNear").html("&nbsp;");
    $("#btn_ptz_focusAuto").html(translator("focus"));
    $("#btn_ptz_focusFar").html("&nbsp;");

    konami(function () {
        if (document.getElementById("Konami").style.display == "block")
            $("#Konami").css("display", "none");
        else
            $("#Konami").css("display", "block");
    });

    $("#ctrl-panel-toggle-icon").attr("title", translator("hide_control_panel"));
    $("#ctrl-panel-toggle-icon").click(function () {
        if (!$(this).hasClass("clicked")) {
            $("#sidebar, #logo").fadeOut(function () {
                $("#ctrl-panel-toggle-icon").css("border-width", "5px 0 5px 5px").css("margin-left", "0px").addClass("clicked").attr("title", translator("show_control_panel"));
                $("#viewsizeCtrlBlk").css("left", "20px")
            });
        }
        else {
            $("#viewsizeCtrlBlk").css("left", "200px");
            $("#sidebar, #logo").fadeIn(function () {
                $("#ctrl-panel-toggle-icon").css("border-width", "5px 5px 5px 0").css("margin-left", "-6px").removeClass("clicked").attr("title", translator("hide_control_panel"));
            });
        }
    });

    //show plugin
    showimage_innerHTML('0', 'showimageBlock', true, false, true);//set baudio=false since FD8134 does not have audio

    if (capability_nuart == "1") //For camera with mechanical ptz
    {
        $("#ptz_control_span").show();
        $("#ptz_panel_selector").show();
    }
    else {
        $("#ptz_control_span").hide();
        $("#ptz_panel_selector").hide();
    }

    pluginCreated();

    if (videoin_c0_rotate == 90 || videoin_c0_rotate == 270) {
        document.getElementById("dz-plugin").style.width = "120px";
        document.getElementById("dz-plugin").style.height = "160px";
    }
    else {
        document.getElementById("dz-plugin").style.width = "160px";
        document.getElementById("dz-plugin").style.height = "120px";
    }
}

function PIrisAdjust(val) {
    var curPos = parseInt($("#slider_sensitivity").slider("value"), 10);
    switch (val) {
        case '-':
            $("#slider_sensitivity").slider("value", curPos - 1);
            break;

        case '+':
            $("#slider_sensitivity").slider("value", curPos + 1);
            break;
    }
}

function VIButtonStatusUpdate(firstLoad, vipin) {
    var VIValue = eval("status_vi_i" + vipin);

    if (layout_custombutton_manualtrigger_show == 1) {
        if (HasManualTriggerPrivilege == true) {
            document.getElementById("manual_trigger_ctrl").style.display = "";
        }
    }

    if (VIValue == "0") {
        if (firstLoad != undefined && firstLoad == true) {
            document.getElementById("btn_vi" + vipin + "_on").style.backgroundPosition = "0px 0px";
            document.getElementById("btn_vi" + vipin + "_off").style.backgroundPosition = "-24px -36px";
            document.getElementById("btn_vi" + vipin + "_on").disabled = false;
            document.getElementById("btn_vi" + vipin + "_off").disabled = true;
        }
        else {
            switch (vipin) {
                case 0:
                    status_vi_i0 = "1";
                    break;
                case 1:
                    status_vi_i1 = "1";
                    break;
                case 2:
                    status_vi_i2 = "1";
                    break;
            }
            document.getElementById("btn_vi" + vipin + "_on").style.backgroundPosition = "0px -36px";
            document.getElementById("btn_vi" + vipin + "_off").style.backgroundPosition = "-24px 0px";
            document.getElementById("btn_vi" + vipin + "_on").disabled = true;
            document.getElementById("btn_vi" + vipin + "_off").disabled = false;
            XMLHttpRequestObject.open("GET", "/cgi-bin/admin/setvi.cgi?vi" + vipin + "=1");
            XMLHttpRequestObject.setRequestHeader("If-Modified-Since", "0");
            XMLHttpRequestObject.send(null);
        }
    }
    else {
        if (firstLoad != undefined && firstLoad == true) {
            document.getElementById("btn_vi" + vipin + "_on").style.backgroundPosition = "0px -36px";
            document.getElementById("btn_vi" + vipin + "_off").style.backgroundPosition = "-24px 0px";
            document.getElementById("btn_vi" + vipin + "_on").disabled = true;
            document.getElementById("btn_vi" + vipin + "_off").disabled = false;
        }
        else {
            switch (vipin) {
                case 0:
                    status_vi_i0 = "0";
                    break;
                case 1:
                    status_vi_i1 = "0";
                    break;
                case 2:
                    status_vi_i2 = "0";
                    break;
            }
            document.getElementById("btn_vi" + vipin + "_on").style.backgroundPosition = "0px 0px";
            document.getElementById("btn_vi" + vipin + "_off").style.backgroundPosition = "-24px -36px";
            document.getElementById("btn_vi" + vipin + "_on").disabled = false;
            document.getElementById("btn_vi" + vipin + "_off").disabled = true;
            XMLHttpRequestObject.open("GET", "/cgi-bin/admin/setvi.cgi?vi" + vipin + "=0");
            XMLHttpRequestObject.setRequestHeader("If-Modified-Since", "0");
            XMLHttpRequestObject.send(null);
        }
    }
}

function toggleVI() {
    switchBlock('manualtrigger_box', 'VIIcon', layoutAdjudement);
}

function initGlobalView() {
    if (streamsource >= FULLVIEW_STREAM_INDEX) {
        if ($("#ROI_Cropbox").css("display") == "block") toggleGV();
        $("#ptz_control").hide();
    }
    else {
        if (capability_videoin_c0_rotation == "1") //rotation mode 
        {
            $("#ptz_globalview").hide();
        }
        else {
            $("#ptz_globalview").show();
        }
        $("#ptz_control").show();
    }
}

function initGVZoomHandle() {
    $('#ROI_Cropbox').mousewheel(
			function (event, delta) {
			    if (delta > 0) {
			        if (value == "mechanical")
			            CamControl('zoom', 'tele');
			        else
			            ePTZControl("zoom", "tele");
			    }
			    else if (delta < 0) {
			        if (value == "mechanical")
			            CamControl('zoom', 'wide');
			        else
			            ePTZControl("zoom", "wide");
			    }
			    return false; // prevent default
			}
			);
}

var bROI_Initialed = false;
var bGVOpen = false;
var refreshImgtimer, refreshROItimer;

var g_bReadyToSendNext = true;
var CGI_REQS_PER_SEC = 15;
var ROI_X, ROI_Y, ROI_W, ROI_H;

function toggleGV() {
    switchBlock('ROI_Cropbox', 'stream1Icon', layoutAdjudement);
    if (!bROI_Initialed) {
        $.ajax({
            url: "/cgi-bin/viewer/getparam_cache.cgi?roi",
            //url: "/cgi-bin/camctrl/eCamCtrl.cgi?stream=" + streamsource,
            async: false,
            dataType: "script",
            success: function (data) {
                Log("getparam?roi: %s", data);
            }
        });

        eval("ROI_X=roi_c0_s" + streamsource + "_home.split(',')[0]");
        eval("ROI_Y=roi_c0_s" + streamsource + "_home.split(',')[1]");
        if (videoin_c0_rotate == 90 || videoin_c0_rotate == 270) {
            eval("ROI_W=roi_c0_s" + streamsource + "_size.split('x')[1]");
            eval("ROI_H=roi_c0_s" + streamsource + "_size.split('x')[0]");

        }
        else {
            eval("ROI_W=roi_c0_s" + streamsource + "_size.split('x')[0]");
            eval("ROI_H=roi_c0_s" + streamsource + "_size.split('x')[1]");
        }

        //get w & h for aspectRatio
        $.ajax({
            url: "/cgi-bin/camctrl/eCamCtrl.cgi?stream=" + streamsource,
            async: false,
            dataType: "script",
            success: function (data) {
                Log("getparam?roi: %s", data);
            }
        });
        //eval("Stream_W=videoin_c0_s"+ streamsource+"_resolution.split('x')[0]");
        //eval("Stream_H=videoin_c0_s"+ streamsource+"_resolution.split('x')[1]");

        ROI_X1 = ROI_X / RATIO_X;
        ROI_Y1 = ROI_Y / RATIO_Y;
        ROI_X2 = (parseInt(ROI_X) + parseInt(ROI_W)) / RATIO_X;
        ROI_Y2 = (parseInt(ROI_Y) + parseInt(ROI_H)) / RATIO_Y;

        if (videoin_c0_rotate == 90 || videoin_c0_rotate == 270) {
            JcropObj = $.Jcrop($('#cropbox'), {
                onChange: showCoords,
                onSelect: showCoords,
                aspectRatio: ROI_W / ROI_H,
                keySupport: true,
                boxWidth: BOXWIDTH,
                boxHeight: BOXHEIGHT,
                minSize: [VideoSize.split('x')[1] / RATIO_Y / 12, VideoSize.split('x')[0] / RATIO_X / 12],  //devided by 12, for at most 12X digital-zoom
                setSelect: [ROI_X1, ROI_Y1, ROI_X2, ROI_Y2],
                trueSize: [TRUEWIDTH, TRUEHEIGHT]
            });
        }
        else {
            JcropObj = $.Jcrop($('#cropbox'), {
                onChange: showCoords,
                onSelect: showCoords,
                aspectRatio: ROI_W / ROI_H,
                keySupport: true,
                boxWidth: BOXWIDTH,
                boxHeight: BOXHEIGHT,
                minSize: [VideoSize.split('x')[0] / RATIO_X / 12, VideoSize.split('x')[1] / RATIO_Y / 12],  //devided by 12, for at most 12X digital-zoom
                setSelect: [ROI_X1, ROI_Y1, ROI_X2, ROI_Y2],
                trueSize: [TRUEWIDTH, TRUEHEIGHT]
            });
        }
        bROI_Initialed = true;
    }

    bGVOpen = !bGVOpen;
    if (bGVOpen) {
        refreshROI();
        refreshImgTimer = setInterval("refreshImage(VIDEO_JPG)", INTERVAL_snapshot);
        refreshROITimer = setInterval("refreshROI()", INTERVAL_ROI);
    }
    else {
        clearInterval(refreshImgTimer);
        clearInterval(refreshROITimer);
    }
}

var pre_coords_x;
var pre_coords_y;
var pre_coords_x2;
var pre_coords_y2;
var g_bPreventResend = false; //prevent ePTZControl caused onChange event to resend CGI to camera.
var g_bUpdatedRencently = false;
var UPDATE_ROI_PERIOD = 10000;
var UpdateTimer = -1;

function showCoords(c) {
    if (g_bPreventResend) {
        g_bPreventResend = false;
        return;
    }

    //prevent send ePTZ.cgi to cause boa overhead when coordinate isn't changed, eg: click on ROI but doesn't drag!
    if (c.x == pre_coords_x &&
			c.y == pre_coords_y &&
			c.x2 == pre_coords_x2 &&
			c.y2 == pre_coords_y2) {
        //Log("%s","Same coords as previous one");
        return;
    }
    else {
        pre_coords_x = c.x;
        pre_coords_y = c.y;
        pre_coords_x2 = c.x2;
        pre_coords_y2 = c.y2;
    }

    $('#x_').val(c.x);
    $('#y_').val(c.y);
    $('#w_').val(c.w);
    $('#h_').val(c.h);

    if (bROI_Initialed) {
        if (!g_bReadyToSendNext) {
            Log("Not Ready To Send Next CGI");
            return;
        }

        if (g_bRefreshROI) //
        {
            //Log("g_bRefreshROI = %d, Animating", g_bRefreshROI); 
            return;
        }

        // Add these 3 line to enable "refreshROI()" once idle for 10 secs.
        clearTimeout(UpdateTimer);
        g_bUpdatedRencently = true;
        UpdateTimer = setTimeout("g_bUpdatedRencently = false;", UPDATE_ROI_PERIOD);

        var coords = JcropObj.tellSelect();
        var RESOLUTION = TRUEWIDTH + "x" + TRUEHEIGHT;
        var CGICmd = '/cgi-bin/camctrl/eCamCtrl.cgi?stream=' + streamsource + '&x=' + coords.x + '&y=' + coords.y + '&w=' + coords.w + '&h=' + coords.h + '&resolution=' + RESOLUTION;

        Log("Sent => %s", CGICmd);
        $.ajax({
            url: CGICmd,
            cache: false,
            async: true,
            success: function (data) {
                //data example=> x=170&y=80&w=640&h=480
                Log("Return value from ePTZ.cgi => %s", data);
                DisplayZoomRatio(data);
            }
        });

        //To limit cgi request per seconds, un-comment below 2 lines.
        if (!g_bLimitFreq) {
            g_bReadyToSendNext = false;
            setTimeout("g_bReadyToSendNext = true;", 1000 / CGI_REQS_PER_SEC);
        }
    }
}

var g_bRefreshROI = false;
function refreshROI() {
    if (!g_bUpdatedRencently) {
        $.ajax({
            url: "/cgi-bin/camctrl/eCamCtrl.cgi?stream=" + streamsource,
            async: true,
            cache: false,
            success: function (data) {
                //Log("refreshROI() Query-eCamctrl.cgi => %s",data);
                g_bRefreshROI = true;
                parseCoords(data);
            }
        });
    }
}

var g_bLimitFreq = false;
function parseCoords(coordsData) {
    //coordsData example=> x=170&y=80&w=640&h=480
    var coords = coordsData.split(',');

    //to round up or down
    ROI_X1 = parseInt((parseInt(coords[0].split('=')[1]) + 5) / RATIO_X);
    ROI_Y1 = parseInt((parseInt(coords[1].split('=')[1]) + 5) / RATIO_Y);
    ROI_X2 = parseInt((parseInt(coords[0].split('=')[1]) + parseInt(coords[2].split('=')[1]) + 5) / RATIO_X);
    ROI_X2 = (ROI_X2 > BOXWIDTH) ? BOXWIDTH : ROI_X2;
    ROI_Y2 = parseInt((parseInt(coords[1].split('=')[1]) + parseInt(coords[3].split('=')[1]) + 5) / RATIO_Y);
    ROI_Y2 = (ROI_Y2 > BOXHEIGHT) ? BOXHEIGHT : ROI_Y2;

    //if Global View is launched, update the window. 
    if (bROI_Initialed) {
        if (g_bSmooth || g_bRefreshROI)
            JcropObj.animateTo([ROI_X1, ROI_Y1, ROI_X2, ROI_Y2]);
        else
            JcropObj.setSelect([ROI_X1, ROI_Y1, ROI_X2, ROI_Y2]);

        DisplayZoomRatio(coordsData);
    }
}

function switchPTZPanel(value) {
    initGVZoomHandle(value);
    $("#ptz_control").css("visibility", "visible");
    if (value == 'mechanical') //mechanical
    {
        if (typeof (WinLessPluginCtrl) != "undefined") $("#" + PLUGIN_ID).attr("PtzURL", "/cgi-bin/camctrl/camctrl.cgi");
        $("#ptz_globalview").hide();

        if (ShowCamCtrl == true) {
            $("table.CtrlArea tr[id=ptz_focus]").show();
            $("#ptz_control").show();
            $("#customcmdBtn-bar").show();
            ShowPresetSelction("mechanical");
            $("#ptz_goto").show();

            if (uart_i0_ptzdriver == 127) //PTZ driver: Custom Camera
            {
                $("#camctrl_c0_panspeed, #camctrl_c0_tiltspeed, #camctrl_c0_zoomspeed, #presetname").attr('disabled', true);
            }
        }
        else {
            $("table.CtrlArea tr[id=ptz_focus]").hide();
            $("#ptz_control").hide();
            $("#customcmdBtn-bar").hide();
            $("#ptz_goto").hide();
            switchPTZPanel('digital');
            return;
        }
        $("#camctrl_c0_panspeed option")[eval(5 - parseInt(camctrl_c0_panspeed))].selected = true;
        $("#camctrl_c0_tiltspeed option")[eval(5 - parseInt(camctrl_c0_tiltspeed))].selected = true;
        $("#camctrl_c0_zoomspeed option")[eval(5 - parseInt(camctrl_c0_zoomspeed))].selected = true;
    }
    else if (value == 'digital') //digital
    {
        if (typeof (PLUGIN_ID) != "undefined") $("#" + PLUGIN_ID).attr("PtzURL", "/cgi-bin/camctrl/eCamCtrl.cgi");
        $("table.CtrlArea tr[id=ptz_focus]").hide();
        $("#camctrl_c0_panspeed option")[eval(5 - parseInt(eptz_c0_panspeed))].selected = true;
        $("#camctrl_c0_tiltspeed option")[eval(5 - parseInt(eptz_c0_tiltspeed))].selected = true;
        $("#camctrl_c0_zoomspeed option")[eval(5 - parseInt(eptz_c0_zoomspeed))].selected = true;
        (streamsource == FULLVIEW_STREAM_INDEX) ? $("#ptz_goto").hide() : $("#ptz_goto").show();
        (streamsource == FULLVIEW_STREAM_INDEX) ? $("#ptz_select_panel").hide() : $("#ptz_select_panel").show();
        ShowPresetSelction("digital");
        $("#customcmdBtn-bar").hide();
        initGlobalView(); // $("#ptz_globalview").show();

        //ePTZ should have these features all the time, they would be set disabled while "uart_i0_ptzdriver == 127"
        $("#camctrl_c0_panspeed, #camctrl_c0_tiltspeed, #camctrl_c0_zoomspeed, #presetname").attr('disabled', false);
    }

    if (value != getCookie("activatedmode")) {
        setCookie("activatedmode", value);
    }
}



function SpecicalCaseHandle() {
    if (lan >= 100) //custom language
        return -1;
    var LanguageSelected = eval('system_info_language_i' + lan);
    //By Kent, for Deutsch layout		
    if (LanguageSelected == "Deutsch") {
        $("#sidebar,.wraptocenter_logo,#sidebar-footer").css("width", "230px");
        if ($.browser.mozilla || $.browser.safari) $("#sidebar-footer").css("width", "210px");
        $("#shadow_container").css("display", "none");

    }

    if (LanguageSelected == "Français" || LanguageSelected == "Italiano") {
        $("#btn_ptz_zoom, #btn_ptz_focusAuto, #btn_ptz_irisAuto").css("backgroundImage", "url(/pic/wide_noword.gif)");
        $("#btn_ptz_zoom, #btn_ptz_focusAuto, #btn_ptz_irisAuto").css("backgroundPosition", "0px 0px");
        $("#btn_ptz_zoom, #btn_ptz_focusAuto, #btn_ptz_irisAuto").css("width", "100px");
    }
}


function initButton() {
    var rtspBtnObj = document.getElementById("RtspCtrlBtn-bar").getElementsByTagName("button");
    for (i = 0; i < rtspBtnObj.length; i++) {
        rtspBtnObj[i].title = translator(rtspBtnObj[i].title);
        addEventSimple(rtspBtnObj[i], 'mouseover', RtspCtrlBtnHandler);
        addEventSimple(rtspBtnObj[i], 'mouseout', RtspCtrlBtnHandler);
        addEventSimple(rtspBtnObj[i], 'mousedown', RtspCtrlBtnHandler);
        addEventSimple(rtspBtnObj[i], 'mouseup', RtspCtrlBtnHandler);
    }

    var BtnObj = document.getElementById("control-area").getElementsByTagName("button");
    for (i = 0; i < BtnObj.length; i++) {
        if (BtnObj[i].id == "btn_ptz_zoom" || BtnObj[i].id == "btn_vi0" || BtnObj[i].id == "btn_vi1" || BtnObj[i].id == "btn_vi2")
            continue;
        addEventSimple(BtnObj[i], 'mouseover', BtnHandler);
        addEventSimple(BtnObj[i], 'mouseout', BtnHandler);
        addEventSimple(BtnObj[i], 'mousedown', BtnHandler);
        addEventSimple(BtnObj[i], 'mouseup', BtnHandler);
    }

    var customcmdBtnObj = document.getElementById("customcmdBtn-bar").getElementsByTagName("button");
    for (var i = 0; i < customcmdBtnObj.length; i++) {
        addEventSimple(customcmdBtnObj[i], 'mouseover', BtnHandler);
        addEventSimple(customcmdBtnObj[i], 'mouseout', BtnHandler);
        addEventSimple(customcmdBtnObj[i], 'mousedown', BtnHandler);
        addEventSimple(customcmdBtnObj[i], 'mouseup', BtnHandler);
    }

    var viewsizeBtnObj = document.getElementById("viewsizeCtrlBlk").getElementsByTagName("button");
    for (i = 0; i < viewsizeBtnObj.length; i++) {
        addEventSimple(viewsizeBtnObj[i], 'mouseover', BtnHandler);
        addEventSimple(viewsizeBtnObj[i], 'mouseout', BtnHandler);
        addEventSimple(viewsizeBtnObj[i], 'mousedown', BtnHandler);
        addEventSimple(viewsizeBtnObj[i], 'mouseup', BtnHandler);
    }
}

function switchStream(selectedIndex) {
    var WinLessPluginCtrlObject = document.getElementById(PLUGIN_ID);

    //deWinLessPluginCallbackFn();

    // plugindef.js  begin
    streamsource = parseInt(selectedIndex, 10);
    eval("VideoSize=videoin_c0_s" + streamsource + "_resolution");
    eval("codectype=videoin_c0_s" + streamsource + "_codectype");
    if (codectype == "mjpeg")
        eval("AccessName=network_http_s" + streamsource + "_accessname");
    else //(codectype == "mpeg4") || (codectype == "h264")
        eval("AccessName=network_rtsp_s" + streamsource + "_accessname");

    evalPluginSize();
    // showimage(0)  begin
    var str_innerHTML = "";

    //if (navigator.userAgent.match("MSIE") != null || navigator.userAgent.match("Firefox") != null)
    if (navigator.userAgent.match("Trident") != null || navigator.userAgent.match("MSIE") != null) {
        //To avoid switch streaming source too fast.
        $("#StreamSelector").attr("disabled", true);

        W = W + X_OFFSET;
        H = H + Y_OFFSET;

        // The ActiveX plug-in
        WinLessPluginCtrlObject.width = W;
        WinLessPluginCtrlObject.height = H;

        // Due to change MJPEG frame level will cause streaming disconnect and then connect automaticlly
        // Thus we must call disconnect in advance to avoid annoying message in front page
        if (codectype == "mjpeg") {
            WinLessPluginCtrlObject.Disconnect();
            //ChangeMJPEGFrameLevel(streamsource);
        }
        WinLessPluginCtrlObject.Url = document.URL;
        WinLessPluginCtrlObject.DarwinConnection = false;
        WinLessPluginCtrlObject.ViewStream = streamsource;
        if (codectype == "mjpeg") {
            WinLessPluginCtrlObject.Connect();
        }

        if (streamsource < FULLVIEW_STREAM_INDEX) {
            $("#digitalZoomRatio").css("display", "block");
            if (HasCamCtrlPrivilege == true) {
                updateStatus("zoom");
            }
        }
        else {
            $("#digitalZoomRatio").css("display", "none");
        }
        /*
		if(streamsource >= 3)
			RtspVapgCtrl.DisplayStringOnVideo("", 25, 1, 30, 30, 255, 255, 255, 0, 0, 0);
		*/
        //setTimeout('document.getElementById("WinLessPluginCtrl").Connect()', 2000);
        setTimeout('$("#StreamSelector").attr("disabled", false)', 3000);
    }
    else if (navigator.appName == "Netscape") {
        if (codectype == "mjpeg") {
            Y_OFFSET = 0;
            thisURL = document.URL;
            http_method = thisURL.split(":");
            if (http_method[0] == "https") {
                str_innerHTML += "<img id=\"" + PLUGIN_ID + "\" src=\"https://" + location.host + "/" + AccessName + "\" width=\"" + Width + "\" height=\"" + Height + "\"/>";
            }
            else {
                str_innerHTML += "<img id=\"" + PLUGIN_ID + "\" src=\"http://" + location.host + "/" + AccessName + "\" width=\"" + Width + "\" height=\"" + Height + "\"/>";
            }
            // update Div(showimageBlock)
            document.getElementById("showimageBlock").innerHTML = str_innerHTML;
        }
        else {
            /*
			Y_OFFSET = 16; // Quicktime contrlbar height
			str_innerHTML += "<embed SCALE=\"ToFit\" id=\"" + PLUGIN_ID + "\" width=\"" + Width + "\" height=\"" + Height + "\"";
			str_innerHTML += " type=\"video/quicktime\" qtsrc=\"rtsp://" + location.hostname + "/" + AccessName + "\"";
			str_innerHTML += " qtsrcdontusebrowser src=\"/realqt.mov\" autoplay=\"true\" controller=\"true\"\>";
			*/

            QtPluginSetup();
        }
    }
    else {
        document.getElementById("showimageBlock").innerHTML = "Please use Firefox, Mozilla or Netscape<br>";
    }

    //Mpeg4_MJpeg_Switch();

    setCookie("streamsource", selectedIndex);

    layoutAdjudement();
    ShowEPTZPanel();

    var viewsizemode = getCookie("viewsizemode");
    if (0 != viewsizemode) {
        switchView($("button.viewstyle:[title*='" + viewsizemode + "']")[0], viewsizemode, true);
    }

    if ($("#StreamSelector").containsOption("FA") == true) {
        ShowFocusAssist = false;

        $("#StreamSelector").removeOption("FA");
        FAButtonStatusUpdate(0);
        $.get('/cgi-bin/admin/setFA_off.cgi');

        $('#ptz_select_panel').show();
        $('#ptz_control').show();
        setPtzURL();
        if (streamsource < FULLVIEW_STREAM_INDEX) {
            setTimeout('$("#digitalZoomRatio").css("display","block");', 500);
        }
    }

    {
        $("div.cover").hide();
        Mpeg4_MJpeg_Switch();
        $("#viewsizeCtrlBlk").css("visibility", "visible");
        $("#RtspCtrlBtn-bar").show();
        layoutAdjudement();
    }

    try {
        if (bIsWinMSIE || bIsFireFox || bIsChrome) {
        }
        else {
            Mpeg4_MJpeg_Switch();
            $("#viewsizeCtrlBlk").css("visibility", "hidden");
            $("#WinLessCtrlBtn-bar").hide();
        }
    }
    catch (err) {
        Log(err.description);
    }

    if (selectedIndex == FULLVIEW_STREAM_INDEX || capability_videoin_c0_rotation == "1") {
        $("#ptz_globalview").hide();
    }
    else {
        $("#ptz_globalview").show();
    }
}

function WinLessReady() {
    $("div.cover").hide();
    Mpeg4_MJpeg_Switch();
    $("#RtspCtrlBtn-bar").show();
    $("#viewsizeCtrlBlk").css("visibility", "visible");
    layoutAdjudement();
}

function ShowEPTZPanel() {
    if ($('select[name="ptz_panel_selector"]').selectedValues() == "digital") {
        initGlobalView();
        if (bROI_Initialed && streamsource < FULLVIEW_STREAM_INDEX) {
            JcropObj.setMinSize([VideoSize.split('x')[0] / RATIO_X / 4, VideoSize.split('x')[1] / RATIO_Y / 4]);
            g_bUpdatedRencently = false;
            refreshROI();
            eval("ROI_X=roi_c0_s" + streamsource + "_home.split(',')[0]");
            eval("ROI_Y=roi_c0_s" + streamsource + "_home.split(',')[1]");
            if (videoin_c0_rotate == 90 || videoin_c0_rotate == 270) {
                eval("ROI_W=roi_c0_s" + streamsource + "_size.split('x')[1]");
                eval("ROI_H=roi_c0_s" + streamsource + "_size.split('x')[0]");
            }
            else {
                eval("ROI_W=roi_c0_s" + streamsource + "_size.split('x')[0]");
                eval("ROI_H=roi_c0_s" + streamsource + "_size.split('x')[1]");
            }
            eval("Stream_W=videoin_c0_s" + streamsource + "_resolution.split('x')[0]");
            eval("Stream_H=videoin_c0_s" + streamsource + "_resolution.split('x')[1]");

            //get w & h for aspectRatio
            $.ajax({
                url: "/cgi-bin/camctrl/eCamCtrl.cgi?stream=" + streamsource,
                async: false,
                dataType: "script",
                success: function (data) {
                    Log("getparam?roi: %s", data);
                }
            });
            //set different aspectRatio for each stream
            JcropObj.setAspectRatio(w / h);
        }
        ShowPresetSelction("digital");
        //stream4 is not capable of preset-feature
        (streamsource == FULLVIEW_STREAM_INDEX) ? $("#ptz_goto").hide() : $("#ptz_goto").show();
        (streamsource == FULLVIEW_STREAM_INDEX) ? $("#ptz_select_panel").hide() : $("#ptz_select_panel").show();

    }
}

/* 
 * PTZ Control
 */

function SubmitPreset(selObj) {
    var ChannelNo = 0;

    if (getCookie("activatedmode") == "mechanical") {
        var CGICmd = '/cgi-bin/camctrl/recall.cgi?channel=' + ChannelNo + '&index=' + $(selObj).selectedOptions().val();
    }
    else {
        var CGICmd = '/cgi-bin/camctrl/eRecall.cgi?stream=' + streamsource + '&recall=' + encodeURIComponent($(selObj).selectedOptions().text());
    }
    parent.retframe.location.href = CGICmd;
    // Show ZoomRatio after goto some presetlocation!
    var preset_num = $(selObj).selectedOptions().val();
    setTimeout("ShowPresetZoomRatio(" + preset_num + ")", 1500);
    Log("Send: %s", CGICmd);
}

function ShowPresetSelction(type) {
    if (streamsource == FULLVIEW_STREAM_INDEX) return;
    $("#presetname").removeOption(/./);

    $("#presetname").addOption("-1", translator("select_one"));
    for (var i = 0; i < 20; i++) {
        var PreName;
        if (type == "mechanical") {
            PreName = eval('camctrl_c0_preset_i' + i + '_name');
        }
        else if (type == "digital") {
            PreName = eval('eptz_c0_s' + streamsource + '_preset_i' + i + '_name');
        }

        if (PreName != "") {
            $("#presetname").addOption(i, PreName, false);
        }
    }

    // hide zoom ratio when in mechanical mode
    if (getCookie("activatedmode") == "mechanical") {
        $("#digitalZoomRatio").css("display", "none");
    }
    else {
        $("#digitalZoomRatio").css("display", "block");
    }

    $("#ptz_panel_selector").change(function () {
        if ($("#ptz_panel_selector option:selected").val() == "mechanical") {
            $("#digitalZoomRatio").css("display", "none");
        }
        else {
            $("#digitalZoomRatio").css("display", "block");
        }
    });
}

function CheckCamCtrl() {
    if ((camctrl_c0_isptz == 0) || (uart_i0_ptzdriver == 128) || (camctrl_enableptztunnel == 1) || (uart_enablehttptunnel == 1)) {
        ShowCamCtrl = false;
    }
    if (uart_i0_ptzdriver == 127) {
        document.getElementById("camctrl_c0_panspeed").disabled = true;
        document.getElementById("camctrl_c0_tiltspeed").disabled = true;
        document.getElementById("camctrl_c0_zoomspeed").disabled = true;
        document.getElementById("presetname").disabled = true;
    }
}

function CheckPrivilege() {
    var CamCtrlPrivilege = 6;
    var DoPrivilege = 6;
    var ManualTriggerPrivilege = 6;

    switch (security_privilege_camctrl) {
        case "admin":
            CamCtrlPrivilege = 6;
            break;

        case "operator":
            CamCtrlPrivilege = 4;
            break;

        case "view":
            CamCtrlPrivilege = 1;
            break;
    }

    switch (security_privilege_do) {
        case "admin":
            DoPrivilege = 6;
            break;

        case "operator":
            DoPrivilege = 4;
            break;

        case "view":
            DoPrivilege = 1;
            break;
    }

    // (null) means root has no password
    HasCamCtrlPrivilege = ((user == "(null)") || (privilege >= CamCtrlPrivilege)) ? true : false;
    HasDoPrivilege = (((user == "(null)") || (privilege >= DoPrivilege)) && (ircutcontrol_enableextled != "1")) ? true : false;
    HasManualTriggerPrivilege = ((user == "(null)") || (privilege >= ManualTriggerPrivilege)) ? true : false;
}

function initPTZPanel() {
    initEPTZParams("global_view");
    $("#cropbox").attr("width", BOXWIDTH).attr("height", BOXHEIGHT).attr('src', VIDEO_JPG);
    $("#ROI_Cropbox").hide(); //move "style='display:none'" from index.html to here to prefetch a image!

    $('select[name="ptz_panel_selector"]').addOption('digital', translator('digital'));

    if (ShowCamCtrl == true) {
        $('select[name="ptz_panel_selector"]').addOption('mechanical', translator('mechanical'), false);
    }

    if (activatedmode == 'digital') {
        switchPTZPanel('digital');
    }
    else {
        switchPTZPanel('mechanical');
        $("select[name='ptz_panel_selector']").val(activatedmode);
    }
}

function ShowCustomCmd() {

    var ChannelNo = 0;
    var CamId = camctrl_c0_cameraid;

    for (var i = 0; i < 5; i++) {
        var speedlinkname = eval('uart_i0_speedlink_i' + i + '_name');

        if (speedlinkname) {
            $("#customcmdBtn-bar").css("display", "block");
            document.write("<button class='customcmdBtn' style='background-Position: -533px 0px;' onclick=\"parent.retframe.location.href='/cgi-bin/camctrl/camctrl.cgi?channel=" + ChannelNo + "&camid=" + CamId + "&speedlink=" + i + "'\">" + speedlinkname + "</button>");
        }

    }
}

function layoutAdjudement() {
    $("#control-area").css("padding-bottom", "0px");
    $("#video-area").css("padding-bottom", "0px");

    if (W >= 720) {
        $("#RtspCtrlBtnBlk").css("width", "auto");
    }
    else {
        $("#RtspCtrlBtnBlk").css("width", "720px");
    }
    /*
        if ($.browser.mozilla && $("#video-area-wrapper").height() >= 528)
        {
            $("#control-area").css("padding-bottom", $("#video-area-wrapper").height() - 528 +'px');
        }     
        else if ($.browser.msie && $("#video-area-wrapper").height() >= 533)
        {
            $("#control-area").css("padding-bottom", $("#video-area-wrapper").height() - 533 +'px');
        }         
        else if ($.browser.safari && $("#video-area-wrapper").height() >= 524)
        {
            $("#control-area").css("padding-bottom", $("#video-area-wrapper").height() - 508 +'px');
        }
        else 
        {
        $("#control-area").css("padding-bottom","0px");
        }    */

    /*if (bIsWinMSIE)
		var leftRightOffset = $("#video-area-wrapper").height() - $("#sidebar").height();
	else
		var leftRightOffset = $("#video-area-wrapper").height() + 30 - $("#sidebar").height();

	if ( leftRightOffset >= 0 )
	{
		oriVal = parseInt($("#control-area").css("padding-bottom").split("px")[0], 10);
		$("#control-area").css("padding-bottom", oriVal + leftRightOffset + 'px');
	}
	else
	{
		oriVal = parseInt($("#video-area-wrapper").css("padding-bottom").split("px")[0], 10);
		$("#video-area-wrapper").css("padding-bottom", oriVal - leftRightOffset + 'px');
	}*/

    oriVal = parseInt($("#control-area").css("padding-bottom").split("px")[0], 10);
    finalVal = $("#sidebar").parent().outerHeight() - $("#sidebar").outerHeight() + oriVal;
    //if (finalVal >=0 ) $("#control-area").css("padding-bottom", finalVal + 'px');
    if (finalVal >= 0) $("#control-area").css("min-height", ($("#control-area").height() + finalVal) + 'px');

    //oriVal = parseInt($("#video-area").css("padding-bottom").split("px")[0], 10);
    //$("#video-area").css("padding-bottom", $("#video-area-wrapper").parent().outerHeight() - $("#video-area-wrapper").outerHeight() + oriVal + 'px');

    // Workaround, to force Browser do vertical-align : middle again.
    $("#ctrl-panel-toggle").css("vertical-align", "").css("vertical-align", "middle");
}

function changlan(seleted_lan) {
    if (seleted_lan == system_info_language_count) {
        if (custom_translator_ok) {
            setCookie("lan", 100);
        }
        else {
            alert(translator(fail_to_load_custom_translator.xml));
            setCookie("lan", 0);
        }
    }
    else {
        setCookie("lan", seleted_lan);
    }
    lan = getCookie("lan");
    location.reload();
}


function MM_preloadImages() { //v3.0
    var d = document;
    if (d.images) {
        if (!d.MM_p)
            d.MM_p = new Array();
        var i, j = d.MM_p.length, a = MM_preloadImages.arguments;
        for (i = 0; i < a.length; i++) {
            if (a[i].indexOf("#") !== 0) {
                d.MM_p[j] = new Image;
                d.MM_p[j++].src = a[i];
            }
        }
    }
}

function PreLoadImages() {
    MM_preloadImages('/pic/plugin.png', '/pic/digitaloutput.png', '/pic/configuration-area.png');
}

function clientsidesnapshot(url) {
    //if (bIsWinMSIE)
    if (bIsWinMSIE || bIsFireFox || bIsChrome) {
        //url = WinLessPluginCtrl.SnapshotUrl;
        url = document.getElementById(PLUGIN_ID).SnapshotUrl;
    }
    if (url != "")
        url += "?streamid=" + streamsource;
    var subWindow = window.open(url, "", "width=800, height=600, scrollbars=yes, resizable=yes, status=yes");
    subWindow.focus();
}

function BtnHandler(event) {
    var object = event.srcElement ? event.srcElement : event.target;
    if (object.clientWidth != object.offsetWidth || object.disabled == true) return;

    X = parseInt(object.style.backgroundPosition.split(" ")[0]).toString(10);
    if (event.type == "mousedown") {
        object.style.backgroundPosition = X + "px " + -2 * object.offsetHeight + "px";
        if (document.all)
            object.hideFocus = true;
        else
            return false;
    }
    else if (event.type == "mouseover" || event.type == "mouseup") {
        object.style.backgroundPosition = X + "px " + -object.offsetHeight + "px";
    }
    else//(e=="mouseout") 
    {
        object.style.backgroundPosition = X + "px " + "0px";
    }
}

function RtspCtrlBtnHandler(event) {
    var object = event.srcElement ? event.srcElement : event.target;

    if (object.clientWidth != object.offsetWidth || object.disabled === true)
        return;

    if (object.id == "btn_play" || bStopEnabled === false) {
        X = parseInt(object.style.backgroundPosition.split(" ")[0]).toString(10);

        if (event.type == "mousedown") {
            if (object.id == "btn_talk") {
                if (bTalkEnabled == false)
                    object.style.backgroundPosition = X + "px " + -2 * object.offsetHeight + "px";
            }
            else if (object.id == "btn_volume") {
                if (bMuteEnabled == false)
                    object.style.backgroundPosition = X + "px " + -2 * object.offsetHeight + "px";
            }
            else if (object.id == "btn_mic_volume") {
                if (bMicMuteEnabled == false)
                    object.style.backgroundPosition = X + "px " + -2 * object.offsetHeight + "px";
            }
            else
                object.style.backgroundPosition = X + "px " + -2 * object.offsetHeight + "px";

            if (document.all)
                object.hideFocus = true;
            else
                return;
        }
        else if (event.type == "mouseover" || event.type == "mouseup") {
            if (object.id == "btn_talk") {
                if (bTalkEnabled == false)
                    object.style.backgroundPosition = X + "px " + -object.offsetHeight + "px";
            }
            else if (object.id == "btn_volume") {
                if (bMuteEnabled == false)
                    object.style.backgroundPosition = X + "px " + -object.offsetHeight + "px";
            }
            else if (object.id == "btn_mic_volume") {
                if (bMicMuteEnabled == false)
                    object.style.backgroundPosition = X + "px " + -object.offsetHeight + "px";
            }
            else {
                object.style.backgroundPosition = X + "px " + -object.offsetHeight + "px";
            }

        }
        else//(e=="mouseout") 
        {
            if (object.id == "btn_talk") {
                if (bTalkEnabled == false)
                    object.style.backgroundPosition = X + "px " + "0px";
                return;
            }
            else if (object.id == "btn_zoom") {
                if (bZoomEnabled == true) {
                    object.style.backgroundPosition = X + "px " + -object.offsetHeight + "px";
                    return;
                }
                else {
                    object.style.backgroundPosition = X + "px " + "0px";
                    return;
                }
            }
            else if (object.id == "btn_volume") {
                if (bMuteEnabled == false) {
                    if (bVolumeEnabled == true) {
                        object.style.backgroundPosition = X + "px " + -object.offsetHeight + "px";
                        return;
                    }
                    else {
                        object.style.backgroundPosition = X + "px " + "0px";
                        return;
                    }
                }
            }
            else if (object.id == "btn_mic_volume") {
                if (bMicMuteEnabled == false) {
                    if (bMicVolumeEnabled == true) {
                        object.style.backgroundPosition = X + "px " + -object.offsetHeight + "px";
                        return;
                    }
                    else {
                        object.style.backgroundPosition = X + "px " + "0px";
                        return;
                    }
                }
            }
            else {
                object.style.backgroundPosition = X + "px " + "0px";
            }
        }

    }
}



function loadRtspCtrlBtnValue() {
    WinLessPluginCtrlObject = document.getElementById(PLUGIN_ID);

    if (bIsWinMSIE || bIsFireFox || bIsChrome) {
        if (typeof (WinLessPluginCtrlObject) == "undefined" || WinLessPluginCtrlObject == null) // for IE and FireFox
            return;

        bMicMuteEnabled = !WinLessPluginCtrlObject.MicMute; // set NOT(inverse value) in order to make toggle true
        WinLessPluginCtrlToggleMicMute();

        if (audioin_c0_mute == 1) {
            document.getElementById("btn_volume").disabled = true;
            document.getElementById("btn_volume").style.backgroundPosition = "-196px -84px";
            document.getElementById("btn_mute").disabled = true;
            document.getElementById("btn_mute").style.backgroundPosition = "-252px -84px";
        }

        if ($("#" + PLUGIN_ID).get(0).GetSettings(1) == "3") //protocol = http, can't talk
        {
            document.getElementById("btn_talk").disabled = true;
            document.getElementById("btn_talk").title = translator("talk_disable");
            document.getElementById("btn_talk").style.backgroundPosition = "-280px -84px";
            document.getElementById("btn_mic_volume").disabled = true;
            document.getElementById("btn_mic_volume").style.backgroundPosition = "-308px -84px";
            document.getElementById("btn_mic_mute").disabled = true;
            document.getElementById("btn_mic_mute").style.backgroundPosition = "-336px -84px";
        }
        else {
            if (bStopEnabled) {
                bTalkEnabled = false;
                document.getElementById("btn_talk").disabled = false;
                document.getElementById("btn_talk").title = translator("talk");
                document.getElementById("btn_talk").style.backgroundPosition = "-280px -0px";
            }

            bMicMuteEnabled = !$("#" + PLUGIN_ID).get(0).MicMute;
            WinLessPluginCtrlToggleMicMute();
            document.getElementById("btn_mic_mute").disabled = false;
        }

        if ($("#" + PLUGIN_ID).get(0).GetSettings(0) == "1") //audio only, cant't zoom
        {
            document.getElementById("btn_zoom").disabled = true;
            document.getElementById("btn_zoom").style.backgroundPosition = "-28px -84px";
            document.getElementById("btn_snapshot").disabled = true;
            document.getElementById("btn_snapshot").style.backgroundPosition = "0px -84px";
            document.getElementById("btn_fullscreen").disabled = true;
            document.getElementById("btn_fullscreen").style.backgroundPosition = "-392px -84px";
        }
        else {
            document.getElementById("btn_zoom").disabled = false;
            document.getElementById("btn_zoom").style.backgroundPosition = "-28px -0px";
            document.getElementById("btn_snapshot").disabled = false;
            document.getElementById("btn_snapshot").style.backgroundPosition = "0px -0px";
            document.getElementById("btn_fullscreen").disabled = false;
            document.getElementById("btn_fullscreen").style.backgroundPosition = "-392px -0px";
        }

        if ($("#" + PLUGIN_ID).get(0).GetSettings(0) != '2' && bContainAudio == true) //Has Audio: not video only and streaming contains audio
        {
            if (!bTalkEnabled) {
                document.getElementById("btn_volume").disabled = false;
                document.getElementById("btn_volume").style.backgroundPosition = "-196px 0px";
                document.getElementById("btn_mute").disabled = false;
                document.getElementById("btn_mute").style.backgroundPosition = "-252px 0px";

                bMuteEnabled = $("#" + PLUGIN_ID).get(0).PlayMute; // set WinLessPluginCtrl.PlayMute as bMuteEnabled initial value
                bMuteEnabled = !bMuteEnabled; // set NOT(inverse value) in order to make toggle true
                WinLessPluginCtrlMuteToggle();
            }
        }
        else {
            document.getElementById("btn_volume").disabled = true;
            document.getElementById("btn_volume").style.backgroundPosition = "-196px -84px";
            document.getElementById("btn_mute").disabled = true;
            document.getElementById("btn_mute").style.backgroundPosition = "-252px -84px";
        }

        document.getElementById("btn_record").disabled = false;
        document.getElementById("btn_record").style.backgroundPosition = "-140px 0px";
        /*
		if ($("#"+PLUGIN_ID).get(0).IsPermissionSufficient)
		{
			document.getElementById("btn_record").disabled = false;
			document.getElementById("btn_record").style.backgroundPosition = "-140px 0px";
			document.getElementById("btn_fullscreen").disabled = false;
			document.getElementById("btn_fullscreen").style.backgroundPosition = "-392px 0px";
		}
		else
		{
			document.getElementById("btn_record").disabled = true;
			document.getElementById("btn_record").style.backgroundPosition = "-140px -84px";
			document.getElementById("btn_fullscreen").disabled = true;
			document.getElementById("btn_fullscreen").style.backgroundPosition = "-392px -84px";
		}
		*/

    }
    else {
        document.getElementById("btn_zoom").disabled = true;
        document.getElementById("btn_zoom").style.backgroundPosition = "-28px -84px";
        document.getElementById("btn_play").disabled = true;
        document.getElementById("btn_play").style.backgroundPosition = "-84px -84px";
        document.getElementById("btn_stop").disabled = true;
        document.getElementById("btn_stop").style.backgroundPosition = "-112px -84px";
        document.getElementById("btn_record").disabled = true;
        document.getElementById("btn_record").style.backgroundPosition = "-140px -84px";
        document.getElementById("btn_volume").disabled = true;
        document.getElementById("btn_volume").style.backgroundPosition = "-196px -84px";
        document.getElementById("btn_mute").disabled = true;
        document.getElementById("btn_mute").style.backgroundPosition = "-252px -84px";
        document.getElementById("btn_talk").disabled = true;
        document.getElementById("btn_talk").style.backgroundPosition = "-280px -84px";
        document.getElementById("btn_mic_volume").disabled = true;
        document.getElementById("btn_mic_volume").style.backgroundPosition = "-308px -84px";
        document.getElementById("btn_mic_mute").disabled = true;
        document.getElementById("btn_mic_mute").style.backgroundPosition = "-364px -84px";
        document.getElementById("btn_fullscreen").disabled = true;
        document.getElementById("btn_fullscreen").style.backgroundPosition = "-392px -84px";
    }

}

function Mpeg4_MJpeg_Switch() {
    if (bIsWinMSIE || bIsFireFox || bIsChrome) {
        // fully initialization for Plugin
        bPlayEnabled = true;
        bStopEnabled = false;
        bRecEnabled = false;
        bTalkEnabled = false;
        document.getElementById("btn_snapshot").disabled = false;
        document.getElementById("btn_snapshot").style.backgroundPosition = "0px 0px";
        document.getElementById("btn_zoom").disabled = false;
        document.getElementById("btn_zoom").style.backgroundPosition = "-28px 0px";
        document.getElementById("btn_play").disabled = false;
        document.getElementById("btn_play").style.backgroundPosition = "-56px 0px";
        document.getElementById("btn_stop").disabled = false;
        document.getElementById("btn_stop").style.backgroundPosition = "-112px 0px";
        document.getElementById("btn_talk").disabled = false;
        document.getElementById("btn_talk").style.backgroundPosition = "-280px 0px";
        document.getElementById("btn_fullscreen").disabled = false;
        document.getElementById("btn_fullscreen").style.backgroundPosition = "-392px 0px";
    }

    if (codectype == "mjpeg") {
        document.getElementById('btn_play').style.display = "none";
        document.getElementById('btn_stop').style.display = "none";
        document.getElementById('btn_volume').style.display = "none";
        document.getElementById('btn_mute').style.display = "none";
        document.getElementById('btn_talk').style.display = "none";
        document.getElementById('btn_mic_volume').style.display = "none";
        document.getElementById('btn_mic_mute').style.display = "none";
    }
    else //(codectype == "mpeg4") || (codectype == "h264")
    {
        document.getElementById('btn_play').style.display = "inline";
        document.getElementById('btn_stop').style.display = "inline";
        document.getElementById('btn_volume').style.display = "inline";
        document.getElementById('btn_mute').style.display = "inline";

        if ((user == "(null)") || (privilege == "4") || (privilege == "6")) //viewer can't talk
        {
            document.getElementById('btn_talk').style.display = "inline";
            document.getElementById('btn_mic_volume').style.display = "inline";
            document.getElementById('btn_mic_mute').style.display = "inline";
        }
        else {
            document.getElementById('btn_talk').style.display = "none";
            document.getElementById('btn_mic_volume').style.display = "none";
            document.getElementById('btn_mic_mute').style.display = "none";
        }
    }

    loadRtspCtrlBtnValue();
}


function updateHomepageColor() {
    switch (layout_theme_option) {
        case "1":
            document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"css/blue_theme_home.css\" media=\"all\"/>");
            break;

        case "2":
            document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"css/gray_theme_home.css\" media=\"all\"/>");
            break;

        case "3":
            document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"css/black_theme_home.css\" media=\"all\"/>");
            break;

        case "4":
            createCSS("table.CtrlArea", "color: " + layout_theme_color_font);
            createCSS("#configuration-area table", "color:" + layout_theme_color_configfont);
            createCSS("#configuration-area td a", "color: " + layout_theme_color_configfont);
            createCSS("div#page_title", "color: " + layout_theme_color_titlefont);

            createCSS("table#frame-wrapper td", "background-color: " + layout_theme_color_case);
            createCSS("table#outter-wrapper td", "background: #fff");
            createCSS("#control-area table td", "background-color: " + layout_theme_color_controlbackground);
            createCSS("#video-area table td", "background-color: " + layout_theme_color_videobackground);
            createCSS("#configuration-area table td", "background-color: " + layout_theme_color_configbackground);
            createCSS("#video-area-wrapper", "background-color: " + layout_theme_color_videobackground);

            createCSS("#control-area", "background-color: " + layout_theme_color_controlbackground);
            createCSS("#configuration-area", "background-color: " + layout_theme_color_configbackground);
            createCSS("#sidebar-footer", "background-color: " + layout_theme_color_configbackground);
            break;
        default:
            break;
    }
}

function btn_clientSetOver() {
    document.getElementById("btn_clientSet").style.backgroundPosition = "0 -20px";
    var client_settings = document.getElementById("client_settings");
    client_settings.style.position = "relative";
    client_settings.style.top = "1px";
    client_settings.style.left = "2px";
}

function btn_clientSetOut() {
    document.getElementById("btn_clientSet").style.backgroundPosition = "0 0";
    var client_settings = document.getElementById("client_settings");
    client_settings.style.position = "relative";
    client_settings.style.top = "0px";
    client_settings.style.left = "0px";

}

function btn_clientSetClick() {
    location.href = "clientset.html";
}


function btn_configurationOver() {
    document.getElementById("btn_configuration").style.backgroundPosition = "-20px -20px";
    var configuration = document.getElementById("configuration");
    configuration.style.position = "relative";
    configuration.style.top = "1px";
    configuration.style.left = "2px";

}

function btn_configurationOut() {
    document.getElementById("btn_configuration").style.backgroundPosition = "-20px 0";
    var configuration = document.getElementById("configuration");
    configuration.style.position = "relative";
    configuration.style.top = "0px";
    configuration.style.left = "0px";
}

function btn_configurationClick() {
    location.href = "/setup/system/system.html";
}


function btn_languageOver() {
    document.getElementById("btn_language").style.backgroundPosition = "-40px -20px";
    var language = document.getElementById("language");
    language.style.position = "relative";
    language.style.top = "1px";
    language.style.left = "2px";

}

function btn_languageOut() {
    document.getElementById("btn_language").style.backgroundPosition = "-40px 0";
    var language = document.getElementById("language");
    language.style.position = "relative";
    language.style.top = "0px";
    language.style.left = "0px";
}

function btn_languageClick() {
    //SlideToggle(document.getElementById('LanguageSelectorDiv'), 'Auto', 'Slide');
    $('#LanguageSelectorDiv').slideToggle('slow');
    var trigger = setInterval("window.scrollBy(0,3)", 1);
    setTimeout('clearInterval(' + trigger + ')', 2000);
}

/***************************************
  for onmoueleave() not support in Fx
****************************************/
function containsDOM(container, containee) {
    var isParent = false;
    do {
        if ((isParent = container == containee))
            break;
        containee = containee.parentNode;
    }
    while (containee != null);
    return isParent;
}

function checkMouseEnter(element, evt) {
    if (element.contains && evt.fromElement) {
        return !element.contains(evt.fromElement);
    }
    else if (evt.relatedTarget) {
        return !containsDOM(element, evt.relatedTarget);
    }
}

function checkMouseLeave(element, evt) {
    if (element.contains && evt.toElement) {
        return !element.contains(evt.toElement);
    }
    else if (evt.relatedTarget) {
        return !containsDOM(element, evt.relatedTarget);
    }
}


function updatePluginState() {
    if (bZoomEnabled) {
        bZoomEnabled = false;
        document.getElementById("btn_zoom").style.backgroundPosition = "-28px 0px";
    }
    if (bVolumeEnabled) {
        bVolumeEnabled = false;
        document.getElementById("btn_volume").style.backgroundPosition = "-196px 0px";
    }
    if (bMicVolumeEnabled) {
        bMicVolumeEnabled = false;
        document.getElementById("btn_mic_volume").style.backgroundPosition = "-308px 0px";
    }
}

function DOButtonStatusUpdate(firstLoad, doIdx) {
    if (ircutcontrol_enableextled == "1") {
        if (parseInt(capability_ndo, 10) == "1") {
            $("#digital_output").css("display", "none");
        }
        else {
            $("#digital_output1").css("display", "none");
        }
    }

    if (eval("status_do_i" + doIdx) == "0") {
        if (firstLoad != undefined && firstLoad == true) {
            $(".btn_do_on")[doIdx].style.backgroundPosition = "0px 0px";
            $(".btn_do_off")[doIdx].style.backgroundPosition = "-24px -36px";
            $(".btn_do_on")[doIdx].disabled = false;
            $(".btn_do_off")[doIdx].disabled = true;
        }
        else {
            eval("status_do_i" + doIdx + "=1");
            $(".btn_do_on")[doIdx].style.backgroundPosition = "0px -36px";
            $(".btn_do_off")[doIdx].style.backgroundPosition = "-24px 0px";
            $(".btn_do_on")[doIdx].disabled = true;
            $(".btn_do_off")[doIdx].disabled = false;
        }
    }
    else {
        if (firstLoad != undefined && firstLoad == true) {
            $(".btn_do_on")[doIdx].style.backgroundPosition = "0px -36px";
            $(".btn_do_off")[doIdx].style.backgroundPosition = "-24px 0px";
            $(".btn_do_on")[doIdx].disabled = true;
            $(".btn_do_off")[doIdx].disabled = false;
        }
        else {
            eval("status_do_i" + doIdx + "=0");
            $(".btn_do_on")[doIdx].style.backgroundPosition = "0px -36px";
            $(".btn_do_on")[doIdx].style.backgroundPosition = "0px 0px";
            $(".btn_do_off")[doIdx].style.backgroundPosition = "-24px -36px";
            $(".btn_do_on")[doIdx].disabled = false;
            $(".btn_do_off")[doIdx].disabled = true;
        }
    }
}

/*
var g_offsetTop   = 120;
var g_offsetBtm   = 80;
var g_offsetLeft  = 240;
var g_offsetRight = 60;
*/
var g_offsetTop = $("#viewsizeCtrlBlk").height() + 105;
var g_offsetBtm = 80;
var g_offsetLeft = 0;
var g_offsetRight = 65;

var g_4x3 = false;
var g_aspectRatio = 1;
var g_vsRatio = 1;

var g_bBindResize = false;

var fnAutoResize = function () {
    switchView($("button.viewstyle:eq(1)")[0], 'Auto', true);
};

//use bForce = true for switchView(Auto) onresize
function switchView(obj, param, bForce) {
    // 1: 100%, 2: Best-fit, 3: 50%, 4: 25%
    // +------------------------------+
    // | $(window).height();          |
    // | $(window).width();           |
    // | $(document).height();        |
    // | $(document).wdith();         |
    // +------------------------------+


    if ("4x3" != param) {
        if (0 == getCookie("viewsizemode")) {
            setCookie("viewsizemode", param);
        }
        else {
            if (param == getCookie("viewsizemode") && bForce == false) {
                return;
            }
            else {
                if (param != getCookie("viewsizemode"))
                    setCookie("viewsizemode", param);
            }
        }

        // Reset default state, except "4:3" btn
        $(".viewstyle:gt(0)").attr("disabled", false).each(function () {
            posObj = $(this).css("backgroundPosition").split(" ");
            $(this).css("backgroundPosition", posObj[0] + " 0px");
        });

        // set selected state
        var posObj = $(obj).css("backgroundPosition").split(" ");
        $(obj).css("backgroundPosition", posObj[0] + " -36px").attr("disabled", true);
    }

    Log("$(window).height()=" + $(window).height() +
		", $(window).width()=" + $(window).width() +
		", $(document).height()=" + $(document).height() +
		", $(document).wdith()=" + $(document).width());

    //Video Server, use D1, 4CIF.. as VideoSize param, so we need to do some modification here.
    if (system_info_firmwareversion.match(/VS/) != null) {
        var VideoSizeW = Width;
        var VideoSizeH = Height;
    }
    else {
        if (videoin_c0_rotate == 90 || videoin_c0_rotate == 270) {
            var VideoSizeW = VideoSize.split('x')[1];
            var VideoSizeH = VideoSize.split('x')[0];
        }
        else {
            var VideoSizeW = VideoSize.split('x')[0];
            var VideoSizeH = VideoSize.split('x')[1];
        }
    }

    var bStretch = true;
    var bShowLeftPanel = true;

    // default value: 100%
    var tmpHeight = Height + Y_OFFSET;
    var tmpWidth = Width + X_OFFSET;

    //Got more space when "Control Panel" is hidden
    ($("#ctrl-panel-toggle-icon").hasClass("clicked")) ? g_offsetLeft = 60 : g_offsetLeft = 240;

    // Mainly used for Video Server 4:3 mode! Other models don't need this!
    // **********************************************************************
    var evalByAspectRatio = function (destVar, srcVar1, srcVar2) {
        if (destVar.match(/tmpWidth/) != null) {
            if (g_aspectRatio == 1) {
                tmpWidth = srcVar1 + X_OFFSET;
            }
            else {
                tmpWidth = srcVar2 * g_aspectRatio + X_OFFSET;
            }
        }
        else {
            if (g_aspectRatio == 1) {
                tmpHeight = srcVar1 + Y_OFFSET;
            }
            else {
                tmpHeight = srcVar2 / g_aspectRatio + Y_OFFSET;
            }
        }
    };
    // **********************************************************************

    switch (param) {
        /*case 'max':
			bStretch = true;
			bShowLeftPanel = false;
			tmpHeight = $(window).height() - g_offsetTop - g_offsetBtm + Y_OFFSET;
			tmpWidth = (tmpHeight - Y_OFFSET) * (Width/Height) + X_OFFSET;
			$(window).unbind("resize");
            break;
        */
        case 'Auto':
            bShowLeftPanel = true;

            reserveH = $(window).height() - g_offsetTop - g_offsetBtm;
            reserveW = $(window).width() - g_offsetLeft - g_offsetRight;
            diffH = VideoSizeH - reserveH;
            diffW = VideoSizeW - reserveW;

            //Decide to do best-fit according to Width or Height
            if (diffH > 0 && diffH > diffW) {
                tmpHeight = reserveH + Y_OFFSET;
                evalByAspectRatio("tmpWidth", (tmpHeight - Y_OFFSET) * (Width / Height), reserveH);

                if (tmpWidth > reserveW) {
                    tmpWidth = reserveW + X_OFFSET;
                    evalByAspectRatio("tmpHeight", (tmpWidth - X_OFFSET) * (Height / Width), reserveW);
                }
            }
            else if (diffW > 0 && diffW > diffH) {
                tmpWidth = reserveW + X_OFFSET;
                evalByAspectRatio("tmpHeight", (tmpWidth - X_OFFSET) * (Height / Width), reserveW);

                if (tmpHeight > reserveH) {
                    tmpHeight = reserveH + Y_OFFSET;
                    evalByAspectRatio("tmpWidth", (tmpHeight - Y_OFFSET) * (Width / Height), reserveH);
                }
            }
            else // availble region is large enough, need not to auto adjust!
            {
                tmpWidth = Width + X_OFFSET;
                evalByAspectRatio("tmpHeight", Height, Width);
            }

            // If browser is resized to a weird shape, it happens..
            // Note that: Precesely tmpHeight should >= (20 + 5 + 1 + 5), tmpWidth should >= (5 + 1 + 5)
            //            to avoid plugin render failed issue.
            if (tmpHeight <= 50 || tmpWidth <= 50) return;

            if (!g_bBindResize) {
                setTimeout("$(window).resize(fnAutoResize);", 500);
                g_bBindResize = true;
            }

            break;

        case '100':
            g_vsRatio = 1;
            bShowLeftPanel = true;

            reserveH = $(window).height() - g_offsetTop - g_offsetBtm;
            reserveW = $(window).width() - g_offsetLeft - g_offsetRight;
            diffH = VideoSizeH - reserveH;
            diffW = VideoSizeW - reserveW;

            //Decide to do best-fit according to Width or Height
            if (diffH > 0 && diffH > diffW) {
                tmpHeight = reserveH + Y_OFFSET;
                evalByAspectRatio("tmpWidth", Width, reserveH);

                if (tmpWidth > reserveW) {
                    tmpWidth = reserveW + X_OFFSET;
                    evalByAspectRatio("tmpHeight", reserveH, reserveW);
                }

            }
            else if (diffW > 0 && diffW > diffH) {
                tmpWidth = reserveW + X_OFFSET;
                evalByAspectRatio("tmpHeight", Height, reserveW);

                if (tmpHeight > reserveH) {
                    tmpHeight = reserveH + Y_OFFSET;
                    evalByAspectRatio("tmpWidth", reserveW, reserveH);
                }
            }
            else // availble region is large enough, need not to auto adjust!
            {
                tmpWidth = Width + X_OFFSET;
                evalByAspectRatio("tmpHeight", Height, Width);
            }
            /*
			tmpWidth = Width + X_OFFSET;
            evalByAspectRatio("tmpHeight", Height, Width);
            */

            $(window).unbind("resize");
            g_bBindResize = false;
            break;

        case '50':
            g_vsRatio = 1 / 2;
            bShowLeftPanel = true;
            tmpWidth = Width / 2 + X_OFFSET;
            evalByAspectRatio("tmpHeight", Height / 2, Width / 2);
            $(window).unbind("resize");
            g_bBindResize = false;
            break;

        case '25':
            g_vsRatio = 1 / 4;
            bShowLeftPanel = true;
            tmpWidth = Width / 4 + X_OFFSET;
            evalByAspectRatio("tmpHeight", Height / 4, Width / 4);
            $(window).unbind("resize");
            g_bBindResize = false;
            break;

        case '4x3':
            bShowLeftPanel = true;

            if ("Auto" == getCookie("viewsizemode")) {
                tmpHeight = $("#" + PLUGIN_ID).height();
                if (g_aspectRatio == 1) {
                    tmpWidth = (tmpHeight - Y_OFFSET) * (Width / Height);
                }
                else {
                    tmpWidth = parseInt((tmpHeight - Y_OFFSET) * 4 / 3, 10) + X_OFFSET;
                }
            }
            else {
                tmpWidth = Width * g_vsRatio + X_OFFSET;
                if (g_aspectRatio == 1) {
                    tmpHeight = Height * g_vsRatio + Y_OFFSET;
                }
                else {
                    tmpHeight = parseInt(tmpWidth * 3 / 4, 10) + Y_OFFSET;
                }
            }

            break;

        default:
            alert('Do nothing now');
            break;
    }

    //(true == bShowLeftPanel) ? $("#sidebar, #logo").show() : $("#sidebar, #logo").hide();

    if (g_bBindResize) {
        // Following two statements may cause width/height change, then cause recursive switchView
        $(window).unbind("resize");
    }

    if (param == "100") {
        $("#" + PLUGIN_ID).attr("height", Height + Y_OFFSET).height(Height + Y_OFFSET);
        $("#" + PLUGIN_ID).attr("width", Width + X_OFFSET).width(Width + X_OFFSET);
    }
    else {
        $("#" + PLUGIN_ID).attr("height", tmpHeight).height(tmpHeight);
        $("#" + PLUGIN_ID).attr("width", tmpWidth).width(tmpWidth);
    }
    $("#showimageBlock").height(tmpHeight).width(tmpWidth);

    if (g_bBindResize) {
        setTimeout("$(window).resize(fnAutoResize);", 1);
    }

    layoutAdjudement();
}

function toggleBtnHandler(obj, arg) {
    if (arg == "bind") {
        addEventSimple(obj, 'mouseover', BtnHandler);
        addEventSimple(obj, 'mouseout', BtnHandler);
        addEventSimple(obj, 'mousedown', BtnHandler);
        addEventSimple(obj, 'mouseup', BtnHandler);
    }
    else if (arg == "unbind") {
        removeEventSimple(obj, 'mouseover', BtnHandler);
        removeEventSimple(obj, 'mouseout', BtnHandler);
        removeEventSimple(obj, 'mousedown', BtnHandler);
        removeEventSimple(obj, 'mouseup', BtnHandler);
    }
}

function Toggle4x3() {
    var object = $("button.viewstyle:eq(0)")[0];
    if ("true" == getCookie("4x3")) {
        object.style.backgroundPosition = "0px 0px";
        object.title = "Enable 4:3";
        setCookie("4x3", "false");
        g_aspectRatio = 1;

        // bind event handler
        toggleBtnHandler(object, "bind");
        switchView($("button.viewstyle:eq(0)")[0], '4x3', false);
    }
    else {
        object.style.backgroundPosition = "0px -36px";
        object.title = "Restore default";
        setCookie("4x3", "true");
        g_aspectRatio = 4 / 3;

        // unbind event handler
        toggleBtnHandler(object, "unbind");
        switchView($("button.viewstyle:eq(0)")[0], '4x3', false);
    }
}

jQuery.fn.slideLeftHide = function (speed, callback) {
    this.animate({ width: "hide", paddingLeft: "hide", paddingRight: "hide", marginLeft: "hide", marginRight: "hide" }, speed, callback);
};
jQuery.fn.slideLeftShow = function (speed, callback) {
    this.animate({ width: "show", paddingLeft: "show", paddingRight: "show", marginLeft: "show", marginRight: "show" }, speed, callback);
};

function FAButtonStatusUpdate(Status) {
    // Get FAMode cookie
    if (Status == "0") {
        document.getElementById("btn_fa_on").style.backgroundPosition = "0px 0px";
        document.getElementById("btn_fa_off").style.backgroundPosition = "-24px -36px";
        document.getElementById("btn_fa_on").disabled = false;
        document.getElementById("btn_fa_off").disabled = true;
    }
    else {
        document.getElementById("btn_fa_on").style.backgroundPosition = "0px -36px";
        document.getElementById("btn_fa_off").style.backgroundPosition = "-24px 0px";
        document.getElementById("btn_fa_on").disabled = true;
        document.getElementById("btn_fa_off").disabled = false;
    }
}

function FAAnyStream() {
    switchStream(2);

    $.ajax({
        type: "POST",
        url: "/cgi-bin/admin/setparam.cgi",
        data: "videoin_c0_s2_resolution=1280x720&videoin_c0_s2_" + videoin_c0_s2_codectype + "_intraperiod=1000&videoin_c0_s2_" + videoin_c0_s2_codectype + "_ratecontrolmode=vbr&videoin_c0_s2_" + videoin_c0_s2_codectype + "_quant=5&videoin_c0_s2_" + videoin_c0_s2_codectype + "_maxframe=60",
        cache: false
    });
    /*	ShowFocusAssist = true;
        var CurrCropSize=videoin_c0_crop_size;
        var WinlessObject = document.getElementById(PLUGIN_ID);
        //evalPluginSize();
        var AccessName = network_rtsp_s2_accessname ;//+ "?codectype=h264&resolution=1280x720&h264_intraperiod=1000&h264_ratecontrolmode=vbr&h264_quant=5&h264_maxframe=30";
        var codectype = videoin_c0_s2_codectype;
        var str_innerHTML = "";
        
        if (bIsWinMSIE || bIsFireFox || bIsChrome)
        {			
            //To avoid switch streaming source too fast.
            $("#StreamSelector").attr("disabled", true);
            WinlessObject.Disconnect();
    
            //W = 1280;
            //H = 720;
            VideoSize=videoin_c0_crop_size;
            //VideoSize="2560x1920";
            evalPluginSize();
            
            // The ActiveX plug-in
            $("#showimageBlock").height(H).width(W);
            $("#"+PLUGIN_ID).height(H);
            $("#"+PLUGIN_ID).width(W);
            //WinlessObject.width = W;
            //WinlessObject.height = H;
    
            var Instr = location.hostname;
            var i = Instr.indexOf(":");
            if ((codectype == "mpeg4") || (codectype == "h264"))
            {	
                if (i > 0)
                {
                    WinlessObject.Url = "rtsp://" + "[" + location.hostname + "]" + "/" + AccessName;
                }
                else if (i == -1)
                {
                    WinlessObject.Url = "rtsp://" + location.hostname + "/" + AccessName;
                }
            }
            else
            {	AccessName = network_http_s2_accessname;
                thisURL = document.URL;
                http_method = thisURL.split(":");
                if (http_method[0] == "https")
                {
                    if (i > 0)
                    {
                        WinlessObject.Url = "https://" + "[" + location.hostname + "]:" + location.port + "/" + AccessName;
                    }
                    else if (i == -1)
                    {
                        WinlessObject.Url = "https://" + location.host + "/" + AccessName;
                    }
                }
                else 
                {
                    if (i > 0)
                    {
                        WinlessObject.Url = "http://" + "[" + location.hostname + "]:" + location.port + "/" + AccessName;
                    }
                    else if (i == -1)
                    {
                        WinlessObject.Url = "http://" + location.host + "/" + AccessName;
                    }
                }
            }
            WinlessObject.DarwinConnection = true;
            WinlessObject.PtzURL = "";
    
            document.getElementById(PLUGIN_ID).Connect();
            setTimeout('$("#StreamSelector").attr("disabled", false)', 3000);
        }
        else if (navigator.appName == "Netscape") 
        {
            if (codectype == "mjpeg") 
            {
                Y_OFFSET = 0;
                thisURL = document.URL;
                http_method = thisURL.split(":");
                if (http_method[0] == "https") 
                {
                    str_innerHTML += "<img id=\"" + PLUGIN_ID + "\" src=\"https://" + location.host + "/" + AccessName + "\" width=\"" + Width + "\" height=\"" + Height + "\"/>";
                }
                else 
                {
                    str_innerHTML += "<img id=\"" + PLUGIN_ID + "\" src=\"http://" + location.host + "/" + AccessName + "\" width=\"" + Width + "\" height=\"" + Height + "\"/>";
                }
            }
            else 
            {
                Y_OFFSET = 16; // Quicktime contrlbar height
                str_innerHTML += "<embed SCALE=\"ToFit\" id=\"" + PLUGIN_ID + "\" width=\"" + W + "\" height=\"" + H + "\"";
                str_innerHTML += " type=\"video/quicktime\" qtsrc=\"rtsp://" + location.hostname + "/" + AccessName + "\"";
                str_innerHTML += " qtsrcdontusebrowser src=\"/realqt.mov\" autoplay=\"true\" controller=\"true\"\>";
            }
    
            // update Div(showimageBlock)  
            document.getElementById("showimageBlock").innerHTML = str_innerHTML;
    
        }
        else 
        {
            document.getElementById("showimageBlock").innerHTML = "Please use Firefox, Mozilla or Netscape<br>";
        }
    */
    // set full screen
    if (bIsWinMSIE || bIsFireFox || bIsChrome) {
        WinLessPluginCtrlFS();
    }

    // hide ptz_control 
    $('#ptz_control').hide();
    $('#ptz_select_panel').hide();

    // add FA to switch stream
    if ($("#StreamSelector").containsOption("FA") == false) {
        $("#StreamSelector")[0].options.add(new Option("FA", "FA"));
    }
    $("#StreamSelector").selectOptions("FA");

    layoutAdjudement();
    $("#digitalZoomRatio").css("display", "none");
}

function BackToOriginalStream() {
    ShowFocusAssist = false;
    var StreamSource = getCookie("streamsource");

    switchStream(StreamSource);
    $('#StreamSelector').selectOptions(StreamSource);
}

function setPtzURL() {
    var WinlessCtrlObject = document.getElementById(PLUGIN_ID);

    if (bIsWinMSIE || bIsFireFox || bIsChrome) {
        if (getCookie("activatedmode") == "mechanical") {
            WinlessCtrlObject.PtzURL = "/cgi-bin/camctrl/camctrl.cgi";
        }
        else {
            WinlessCtrlObject.PtzURL = "/cgi-bin/camctrl/eCamCtrl.cgi";
        }
    }
}

function JoyStickInfo(PluginId, btnIdx, actIdx, bPress) {
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
        case 14://Digital output 5 on/off
        case 15://Digital output 6 on/off
        case 16://Digital output 7 on/off
        case 17://Digital output 8 on/off

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
        default:
            if (streamsource >= FULLVIEW_STREAM_INDEX)
                break;
            var preset_name;
            var preset_index = eval(actIdx - 18);
            eval("preset_name=eptz_c0_s" + streamsource + "_preset_i" + preset_index + "_name");
            if (getCookie("activatedmode") == "mechanical") {
                var CGICmd = '/cgi-bin/camctrl/recall.cgi?channel=' + channelsource + '&index=' + parseInt(actIdx - 18);//$(selObj).selectedOptions().val();
            }
            else {
                //				var CGICmd='/cgi-bin/camctrl/eRecall.cgi?channel=' + channelsource + '&stream=' + streamsource + '&recall=' + encodeURIComponent($(selObj).selectedOptions().text());
                //				var CGICmd='/cgi-bin/camctrl/eRecall.cgi?channel=' + channelsource + '&stream=' + streamsource + '&recall=' + document.getElementById("presetname").options[actIdx-18+1].text();i
                var CGICmd = '/cgi-bin/camctrl/eRecall.cgi?channel=' + channelsource + '&stream=' + streamsource + '&recall=' + preset_name;
            }
            parent.retframe.location.href = CGICmd;
            Log("Send: %s", CGICmd);
            break;
    }

}

function GenerateDOList() {
    for (iDO = parseInt(capability_ndo, 10) - 1 ; iDO >= 0; iDO--) {
        if (parseInt(capability_ndo, 10) == "1") {
            digital_output_num = '';
        }
        else {
            digital_output_num = eval(iDO + 1);
        }
        $(document.getElementById("manual_trigger_ctrl")).after(""
		+ '<tr id="digital_output' + eval(iDO + 1) + '" height="22px">'
		+ '  <td>'
		+ '    <span title="symbol" style="margin-left:2px;margin-right=2px">' + translator("digital_output") + '</span>' + digital_output_num + ':&nbsp;'
		+ '  </td>'
		+ '  <td>'
		+ '    <div id="digitalOutPut-bar" style="margin-left:2px">'
		+ '      <button class="btn_do_on" style="background-Position: 0px 0px;" onclick="DOButtonStatusUpdate(false,' + iDO + ');retframe.location.href=\'/cgi-bin/dido/setdo.cgi?do' + iDO + '=1\';"></button>'
		+ '      <button class="btn_do_off" style="background-Position: -24px 0px;" onclick="DOButtonStatusUpdate(false,' + iDO + ');retframe.location.href=\'/cgi-bin/dido/setdo.cgi?do' + iDO + '=0\';"></button>'
		+ '    </div>'
		+ '</td>'
		+ '</tr>');
    }
}

