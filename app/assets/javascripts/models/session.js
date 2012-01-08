Session = Backbone.Model.extend({

  when: function() {
    return new Date(this.get('when'));
  },

  room: function() {
    var room = this.get('room');
    if (room.length == 1) return "Room " + room;
    else return room;
  },

  isPreCompiler: function() {
    var title = this.get('title');
    if (title.match(/^PreCompiler: /)) return true;
    else return false;
  },

  title: function() {
    var title = this.get('title');
    if (this.isPreCompiler()) {
      return title.replace("PreCompiler: ", '');
    } else return this.get('title');
  },

  abstract: function() {
    return this.get('abstract');
  },

  technology: function() {
    return this.get('technology');
  },

  speakerName: function() {
    return this.get('speakerName');
  },

  difficulty: function() {
    return this.get('difficulty');
  },

  uniqueId: function() {
    return (this.get('lookup') + "").toLowerCase();
  },

  pageId: function() {
    return "session-" + NextGuidSuffix() + "-" + this.uniqueId();
  },

  isFavorite: function() {
    return Favorites.containsSession(this);
  },

  markAsFavorite: function() {
    Favorites.addFavorite(this);
    this.trigger('change');
  },

  unmarkAsFavorite: function() {
    Favorites.removeFavorite(this);
    this.trigger('change');
  },

  toggleFavorite: function() {
    if (this.isFavorite()) this.unmarkAsFavorite();
    else this.markAsFavorite();
  },

  fulltext: function() {
    return [this.speakerName().toLowerCase(),
      this.title().toLowerCase(),
      this.abstract().toLowerCase(),
      this.technology().toLowerCase()].join(" ");
  },

  extra: function() {
    return this.technology() + ", " + this.difficulty();
  },

  isKidzMash: function() {
    return this.title().match(/^KidzMash/) !== null;
  },

  isVendorSession: function() {
    return this.title().match(/^Vendor Sessions/) !== null;
  },

  isMeal: function() {
    return this.title().match(/^(Breakfast|Lunch|Dinner)/);
  },

  isCodeMashFamilies: function() {
    return this.title().match(/^CodeMash Fam/);
  },

  isRegistration: function() {
    return this.title().match(/^(Registration|Social: Attendee Party)/);
  },

  isGameRoom: function() {
    return this.title().match(/^Game Room/);
  }

});

Session.findWithPageId = function(pageId) {
  var sessionId = pageId.replace(/^session-\d+-/, '');
  return Database.sessions.withUniqueId(sessionId);
}

