$(function() {
  Database.initialize();
});

$(document).bind('pagebeforechange', function(e, data) {
  Database.ensureInitialized();

  if (typeof data.toPage !== 'string') return;
  var url = $.mobile.path.parseUrl(data.toPage);
  var $page = $(url.hash);
  if ($page.length > 0) return;

  var pageId = url.hash.replace(/#/,'');
  Router.routeToPageId(pageId);

});

$("#home_page").live('pageinit', function() {
  $page = $("#home_page");

  $page.find('a.favorites-link').append(
    (new FavoriteCountBubbleView({sessions: Database.sessions})).render().el
  );
  $page.find('a.precompiler-link').append(
    (new FavoriteCountBubbleView({sessions: Database.sessions.filter().precompiler()})).render().el
  );
  $page.find('a.thursday-link').append(
    (new FavoriteCountBubbleView({sessions: Database.sessions.filter().thursday()})).render().el
  );
  $page.find('a.friday-link').append(
    (new FavoriteCountBubbleView({sessions: Database.sessions.filter().friday()})).render().el
  );

  _.defer(function() {
    $page.find("ul").listview('refresh');
  });
});

$(document).bind('pagechange', function(e, data) {
  if (data.options.reverse && data.options.fromPage) {
    // Remove the old page we're coming back from
    var $page = $(data.options.fromPage);
    if ($page.attr('id') !== 'room_map') $(data.options.fromPage).remove();
  }

  // Need to keep resetting this so that any bookmarks have the right title
  $("head title").text("CodeMash");
});

Router = {
  routeToPageId: function(pageId) {
    if (this.isSessionId(pageId)) {
      this.displaySession(pageId);
    } else if (this.isSessionSlotId(pageId)) {
      this.displaySessionSlot(pageId);
    } else {
      this[pageId]();
    }
  },

  room_map: function() {
    (new RoomMapPageView()).render();
  },

  favorites: function() {
    (new SessionListPageView({
      sessions: Favorites.sessions(),
      title: 'Favorites',
      id: 'favorites',
      groupByDate: true
    })).render();
  },

  precompiler_sessions: function() {
    (new SessionHourListPageView({
      id: "precompiler_sessions",
      sessions: Database.sessions.filter().precompiler(),
      title: "Precompiler"
    })).render();
  },

  thursday_sessions: function() {
    (new SessionHourListPageView({
      id: "thursday_sessions",
      sessions: Database.sessions.filter().thursday(),
      title: "Thursday"
    })).render();
  },

  friday_sessions: function() {
    (new SessionHourListPageView({
      id: "friday_sessions",
      sessions: Database.sessions.filter().friday(),
      title: "Friday"
    })).render();
  },

  isSessionId: function(pageId) {
    return pageId.search(/^session-/) !== -1;
  },

  isSessionSlotId: function(pageId) {
    return pageId.search(/^sessionslot-/) !== -1;
  },

  displaySession: function(pageId) {
    var session = Session.findWithPageId(pageId);
    if (!session) {
      console.log("Could not find session with id", pageId);
      return;
    }

    var page = new SessionDetailPageView({ model: session, id: pageId });
    $("body").append(page.render().el);
  },

  displaySessionSlot: function(pageId) {
    var when = SessionTimeSlot.timeFromPageId(pageId);
    if (!when) {
      console.log("Could not find session slot for", pageId);
      return;
    }

    var sessions = Database.sessions.filter().byTimeSlot(when);

    var page = new SessionListPageView({
      sessions: sessions,
      id: pageId,
      title: when.strftime("%a %I:%M %P").replace(/ 0/, ' ')
    });
    $("body").append(page.render().el);
  }

}
