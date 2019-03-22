var Desktop = {
    options: {
        windowArea: ".window-area",
        windowAreaClass: "",
        taskBar: ".task-bar > .tasks",
        taskBarClass: ""
    },

    wins: {},

    setup: function(options){
        this.options = $.extend( {}, this.options, options );
        return this;
    },

    addToTaskBar: function(wnd){
        var icon = wnd.getIcon();
        var wID = wnd.win.attr("id");
        var item = $("<span>").addClass("task-bar-item started").html(icon);

        item.data("wID", wID);

        item.appendTo($(this.options.taskBar));
        item.on('click',function(){
            wnd.win.toggle();
        })
    },

    removeFromTaskBar: function(wnd){
        console.log(wnd);
        var wID = wnd.attr("id");
        var items = $(".task-bar-item");
        var that = this;
        $.each(items, function(){
            var item = $(this);
            if (item.data("wID") === wID) {
                delete that.wins[wID];
                item.remove();
            }
        })
    },

    createWindow: function(o){
        var that = this;
        o.onDragStart = function(pos, el){
            win = $(el);
            $(".window").css("z-index", 1);
            if (!win.hasClass("modal"))
                win.css("z-index", 3);
        };
        o.onDragStop = function(pos, el){
            win = $(el);
            if (!win.hasClass("modal"))
                win.css("z-index", 2);
        };
        o.onWindowDestroy = function(win){
            that.removeFromTaskBar(win);
        };
        o.onMinClick=function(win){
            win.toggleClass("minimized");
            win.hide();

        }
        var w = $("<div>").appendTo($(this.options.windowArea));
        var wnd = w.window(o).data("window");

        var win = wnd.win;
        var shift = Metro.utils.objectLength(this.wins) * 25;

        if (wnd.options.place === "auto" && wnd.options.top === "auto" && wnd.options.left === "auto") {
            win.css({
                top: shift+100,
                left: shift+300
            });
        }
        this.wins[win.attr("id")] = wnd;
        this.addToTaskBar(wnd);
        w.remove();
    }
};

Desktop.setup();

var w_icons = [
    'rocket', 'apps', 'cog', 'anchor'
];
var w_titles = [
    'rocket', 'apps', 'cog', 'anchor'
];

function createWindow(){
    var index = Metro.utils.random(0, 3);
    Desktop.createWindow({
        resizeable: true,
        draggable: true,
        width: 300,
        icon: "<span class='mif-"+w_icons[index]+"'></span>",
        title: w_titles[index],
        content: "<div class='p-2'>This is desktop demo created with Metro 4 Components Library</div>"
    });
}

function createWindowWithCustomButtons(){
    var index = Metro.utils.random(0, 3);
    var customButtons = [
        {
            html: "<span class='mif-rocket'></span>",
            cls: "sys-button",
            onclick: "alert('You press rocket button')"
        },
        {
            html: "<span class='mif-user'></span>",
            cls: "alert",
            onclick: "alert('You press user button')"
        },
        {
            html: "<span class='mif-cog'></span>",
            cls: "warning",
            onclick: "alert('You press cog button')"
        }
    ];
    Desktop.createWindow({
        resizeable: true,
        draggable: true,
        customButtons: customButtons,
        width: 360,
        icon: "<span class='mif-"+w_icons[index]+"'></span>",
        title: w_titles[index],
        content: "<div class='p-2'>This is desktop demo created with Metro 4 Components Library.<br><br>This window has a custom buttons in caption.</div>"
    });
}

function createWindowModal(){
    Desktop.createWindow({
        resizeable: false,
        draggable: true,
        width: 300,
        icon: "<span class='mif-cogs'></span>",
        title: "Modal window",
        content: "<div class='p-2'>This is desktop demo created with Metro 4 Components Library</div>",
        overlay: true,
        //overlayColor: "transparent",
        modal: true,
        place: "center",
        onShow: function(win){
            win.addClass("ani-swoopInTop");
            setTimeout(function(){
                win.removeClass("ani-swoopInTop");
            }, 1000);
        },
        onClose: function(win){
            win.addClass("ani-swoopOutTop");
        }
    });
}

function createWindowYoutube(optionsParams){
    // Metro.charms.close("#charm");
    var defaultOptions={
        resizeable: true,
        draggable: true,
        width: 800,
        height:500,
        icon: "<span class='mif-youtube'></span>",
        title: "Youtube video",
        content: "<div class='embed-container'><iframe src='https://youtu.be/S9MeTn1i72g'></iframe></div>",
        clsContent: "bg-dark"
    }

    var options=$.extend({}, defaultOptions, optionsParams);
    Desktop.createWindow(options);
}

function openCharm() {
    var charm = $("#charm").data("charms");
    charm.toggle();
}

$(".window-area").on("click", function(){
    Metro.charms.close("#charm");
});

$(".charm-tile").on("click", function(){
    $(this).toggleClass("active");
});

var params=
{
    title:'智习客',
    url:'https://www.test.zhixike.net/school',
    icon:'<span class="mif-home"></span>',
    content:"<div class='embed-container'><iframe src='https://www.test.zhixike.net/school'></iframe></div>",
    id:'1'
};