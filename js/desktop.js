var Desktop = {
  options: {
    windowArea: '.window-area',
    windowAreaClass: '',
    taskBar: '.task-bar > .tasks',
    taskBarClass: ''
  },

  wins: {},

  setup: function(options) {
    this.options = $.extend({}, this.options, options)
    return this
  },

  addToTaskBar: function(wnd) {
    var icon = wnd.getIcon()
    var wID = wnd.win.attr('id')
    var item = $('<span>')
      .addClass('task-bar-item started')
      .html(icon)

    item.data('wID', wID)

    item.appendTo($(this.options.taskBar))
    item.on('click', function() {

      if (wnd.win.css('display') === 'none') {
        for (let a in Desktop.wins) {
          Desktop.wins[a].win.removeClass('window-current')
        }
        wnd.win.addClass('window-current')
      }else{
        wnd.win.removeClass('window-current')
      }
      wnd.win.toggle()
    })
  },

  removeFromTaskBar: function(wnd) {
    var wID = wnd.attr('id')
    var items = $('.task-bar-item')
    var that = this
    $.each(items, function() {
      var item = $(this)
      if (item.data('wID') === wID) {
        delete that.wins[wID]
        item.remove()
      }
    })
  },

  createWindow: function(o, tileConfig) {
    var that = this
    o.onDragStart = function(pos, el) {
      win = $(el)
      $('.window').css('z-index', 1)
      for (let a in Desktop.wins) {
        Desktop.wins[a].win.removeClass('window-current')
      }
    }
    o.onDragStop = function(pos, el) {
      win = $(this)
      win.addClass('window-current')
    }
    o.onWindowDestroy = function(win) {
      that.removeFromTaskBar(win)
      tileConfig['windowId'] = null
    }
    o.onMinClick = function(win) {
      win.toggleClass('minimized')
      win.hide()
    }
    var w = $('<div>').appendTo($(this.options.windowArea))
    var wnd = w.window(o).data('window')

    var win = wnd.win
    var shift = Metro.utils.objectLength(this.wins) * 25

    if (
      wnd.options.place === 'auto' &&
      wnd.options.top === 'auto' &&
      wnd.options.left === 'auto'
    ) {
      win.css({
        top: shift + 100,
        left: shift + 300
      })
    }
    this.wins[win.attr('id')] = wnd
    if (tileConfig) {
      tileConfig.windowId = win.attr('id')
    }
    wnd.win.addClass('window-current')
    this.addToTaskBar(wnd)
    w.remove()
  }
}

Desktop.setup()

var w_icons = ['rocket', 'apps', 'cog', 'anchor']
var w_titles = ['rocket', 'apps', 'cog', 'anchor']

function createWindow() {
  var index = Metro.utils.random(0, 3)
  Desktop.createWindow({
    resizeable: true,
    draggable: true,
    width: 300,
    icon: "<span class='mif-" + w_icons[index] + "'></span>",
    title: w_titles[index],
    content:
      "<div class='p-2'>This is desktop demo created with Metro 4 Components Library</div>"
  })
}

function createWindowWithCustomButtons() {
  var index = Metro.utils.random(0, 3)
  var customButtons = [
    {
      html: "<span class='mif-rocket'></span>",
      cls: 'sys-button',
      onclick: "alert('You press rocket button')"
    },
    {
      html: "<span class='mif-user'></span>",
      cls: 'alert',
      onclick: "alert('You press user button')"
    },
    {
      html: "<span class='mif-cog'></span>",
      cls: 'warning',
      onclick: "alert('You press cog button')"
    }
  ]
  Desktop.createWindow({
    resizeable: true,
    draggable: true,
    customButtons: customButtons,
    width: 360,
    icon: "<span class='mif-" + w_icons[index] + "'></span>",
    title: w_titles[index],
    content:
      "<div class='p-2'>This is desktop demo created with Metro 4 Components Library.<br><br>This window has a custom buttons in caption.</div>"
  })
}

function createWindowModal() {
  Desktop.createWindow({
    resizeable: false,
    draggable: true,
    width: 300,
    icon: "<span class='mif-cogs'></span>",
    title: 'Modal window',
    content:
      "<div class='p-2'>This is desktop demo created with Metro 4 Components Library</div>",
    overlay: true,
    //overlayColor: "transparent",
    modal: true,
    place: 'center',
    onShow: function(win) {
      win.addClass('ani-swoopInTop')
      setTimeout(function() {
        win.removeClass('ani-swoopInTop')
      }, 1000)
    },
    onClose: function(win) {
      win.addClass('ani-swoopOutTop')
    }
  })
}

function createWindowIframe(tileConfig) {
  // Metro.charms.close("#charm");
  var defaultOptions = {
    resizeable: true,
    draggable: true,
    width: tileConfig.width?tileConfig.width:800,
    height: tileConfig.height?tileConfig.height:500,
    icon: '<span class=' + tileConfig.icon + '></span>',
    title: tileConfig.brandingBar,
    content:
      "<div class='embed-container'><iframe src=" +
      tileConfig.url +
      '></iframe></div>'
  }
  Desktop.createWindow(defaultOptions, tileConfig)
}

function openCharm() {
  var charm = $('#charm').data('charms')
  charm.toggle()
}

$('.window-area').on('click', function() {
  Metro.charms.close('#charm')
})

$('.charm-tile').on('click', function() {
  $(this).toggleClass('active')
})

$('[data-role="tile"]').on('click', function() {
  var ids = $(this)
    .data('id')
    .split('-')
  var tileConfig = window.desktopConfig.groups[ids[0]].tiles[parseInt(ids[1])]

  for (let a in Desktop.wins) {
    Desktop.wins[a].win.removeClass('window-current')
  }
  if (tileConfig.windowId) {
    var $win = Desktop.wins[tileConfig.windowId].win
    $win.show()
    $win.addClass('window-current')
  } else {
    createWindowIframe(tileConfig)
  }
})
