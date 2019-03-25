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

function createWindowIframe(tileConfig) {
  var defaultOptions = {
    resizeable: true,
    draggable: true,
    width: tileConfig.width?tileConfig.width:800,
    height: tileConfig.height?tileConfig.height:500,
    icon: tileConfig.iconUrl?'<img src='+tileConfig.iconUrl+' />':'<span class=' + tileConfig.icon + '></span>',
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
