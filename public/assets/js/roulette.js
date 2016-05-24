;(function($, window, document, undefined){
'use strict';

var socket = io();
//var socket = io.connect(window.location.href);
console.log(window.location.href);

var player_num = 8;


function notice( message ) {
    // Notificationを取得
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
 
    // Notificationの権限チェック
    Notification.requestPermission(function (permission) {
        // console.log(permission);
    });
 
    // 通知インスタンス生成
    var notify = new Notification('ブキチくん', {
      body: message,
      icon: "assets/img/notification-icon-1.png"
    });
    setTimeout(function() {
      notify.close();
    }, 5000);
    notify.onclick = function () {
      console.log("onclick");
    };
    notify.onerror = function () {
      console.log("onerror");
    };
    notify.onshow = function () {
      console.log("onshow");
    };
    notify.onclose = function () {
      console.log("onclose");
    };
}


var ViewModel = Backbone.Model.extend({
  defaults: function() {
    console.log( new XDate().toString('yyyy/MM/dd') );
    return {
      finalUpdateTime: new XDate().toString('h時m分s秒'),
      finalUpdateDate: new XDate().toString('yyyy年MM月dd日'),
      weaponsItemHTML: ''
    }
  }
});



/*
## プレイヤー
*/

var Player = Backbone.Model.extend({
  
  defaults: function() {
    return {
      index: 0,
      name: '',
      buki: null,
      buki_jp: ''
    }
  },
  
  initialize: function() {
    _.bindAll(this, 'changeBuki', 'changeName', 'shuffleWeapon');
    //this.on('change', _.bind());
    this.on('change:buki', this.changeBuki);
    this.on('change:name', this.changeName);
    this.changeBuki();
    //this.set('index', this.collection.length + 1);
    this.on('change', function(self) {
      //console.log(self.toJSON());
    });
  },
  
  changeName: function() {
    var buki = this.get('buki');
    if( null === buki ) {
      this.shuffleWeapon();
    }
  },
  
  changeBuki: function() {
    var name = this.get('name'),
        buki = this.get('buki');
    if(null != buki) {
      var buki_jp = ca.weapons[buki].name;
      console.log('change buki', name, buki, buki_jp);
      this.set('buki_jp', buki_jp);
    }
  },
  
  shuffleWeapon: function() {
    var i = Math.floor( Math.random() * ca.weapons.length );
    var name = this.get('name');
    if( '' != name ) {
      this.set({
        buki: i
      });
    }
  }
  
});



/*
## プレイヤーリスト
*/

var PlayerList = Backbone.Collection.extend({
  
  model: Player,
  
  initialize: function() {
    _.bindAll(this, 'shuffleWeapon');
  },
  
  shuffleWeapon: function() {
    _.each(this.models, function(model) {
      model.shuffleWeapon();
    });
  }
  
});



/*
## Router
*/

var Router = Backbone.Router.extend({
  
  routes: {
    '': 'home',
    '/:id': 'room'
  },
  
  hone: function() {
    console.log('home');
  },
  
  room: function(id) {
    console.log('room', id);
  }
  
});



/*
## View
*/

var ViewArgs = {
  
  el: '#view',
  
  events: {
    'change .js-input': 'changePlayerData',
    'click .js-shuffle': 'shuffle',
    'click .js-save': 'save'
  },
  
  initialize: function() {
    var self = this;
    _.bindAll(this, 'render', 'shuffle',
      'sync_players', 'sync_attrs',
      'receive_players', 'receive_attrs',
      'changePlayerData'
    );
    
    this.router = new Router();
    Backbone.history.start();
    
    
    this.$contents = this.$('.js-contents');
    
    this.template = {
      view: _.template( $('#view-template').html() ),
      weaponsItem: _.template( $('#weapons-item-template').html() )
    }
    
    this.attrs = new ViewModel();
    this.players = new PlayerList();
    
    this.players.on('change', _.bind(function() {
      var html = this.players.map(_.bind(function(model, index) {
        return this.template.weaponsItem( model.toJSON() );
      }, this)).join('');
      this.attrs.set('weaponsItemHTML', html);
      console.log('players', 'change');
    }, this));
    
    //this.load();
    
    this.players.on('change', this.render);
    this.players.on('change', this.sync_players);
    this.players.on('change', this.sync_attrs);
    this.on('sync_players', this.sync_players);
    this.on('sync_attrs', this.sync_attrs);
    
    socket.on('receive_players', this.receive_players);
    socket.on('receive_attrs', this.receive_attrs);
    /*
    socket.on('s2c_connected', function(args){
      console.log('s2c_connected');
      console.log('roomID', IKA.roomID);
    });
    //socket.emit('c2s_connected');
    */
    socket.emit('c2s_connected', {
      roomID: IKA.roomID
    });
  },
  
  shuffle: function(e) {
    console.count('shuffle');
    this.players.shuffleWeapon();
    this.trigger('sync_players');
    this.trigger('sync_attrs');
  },
  
  receive_players: function(players) {
    console.count('receive_players');
    console.log(players, null === players);
    if((null === players || undefined === players) && 0 === this.players.length) {
      for(var i = 0; i < 8; i++){
        this.players.add({
          index: i
        });
      }
    } else {
      players = JSON.parse(players);
      this.players.set(players, {silent: true});
    }
    console.log('players', this.players);
    //
    /*
    var html = this.players.map(_.bind(function(player) {
      return this.template.weaponsItem( player.attributes );
    }, this)).join('');
    this.attrs.set('weaponsItemHTML', html);
    */
  },
  
  receive_attrs: function(attrs) {
    console.count('receive_attrs');
    //var attrsStr = JSON.stringify(this.attrs.attributes);
    if( null != attrs ){
      attrs = JSON.parse(attrs);
      this.attrs.set(attrs, {silent: true});
      notice('シャッフルしたでし！');
    }
    
    var html = this.players.map(_.bind(function(player) {
      return this.template.weaponsItem( player.attributes );
    }, this)).join('');
    this.attrs.set('weaponsItemHTML', html);
    
    this.render();
  },
  
  render: function() {
    console.count('render');
    var html = this.template.view( this.attrs.attributes );
    this.$contents.html(html);
    return this;
  },
  
  changePlayerData: function(e) {
    var $input = $(e.target),
        val = $input.val(),
        item = $input.attr('name'),
        player = Number( $input.attr('data-player') );
    this.players.at(player).set(item, val);
  }
  
};



/*
### セーブ＆ロード
*/

ViewArgs = _.extend({
  
  save: function() {
    console.count('save');
    var players = this.players.toJSON();
    players = JSON.stringify(players);
    $.cookie('players', players, {expires: 365, path: '/'});
    notice('セーブしたでし！');
  },
  
  load: function() {
    console.group('load');
    var players = $.cookie('players');
    if( players ) {
      //console.log(players);
      players = JSON.parse(players);
      console.log(players);
      this.players.set(players);
    } else {
      for(var i = 0; i < player_num; i++) {
        this.players.add({index: i});
      }
    }
    console.groupEnd();
  }
  
}, ViewArgs);



/*
### Socketとやり取り
*/

ViewArgs = _.extend({
  
  sync_players: function() {
    var players = JSON.stringify( this.players.toJSON() );
    socket.emit('sync_players', players);
  },
  
  sync_attrs: function() {
    var attrs = JSON.stringify( this.attrs.toJSON() );
    socket.emit('sync_attrs', attrs);
    notice('みんなに共有したでし！');
  }
  
}, ViewArgs);


//
var View = Backbone.View.extend(ViewArgs);



/*
## app
*/

$(function() {
  
  new View();
  
});


})(jQuery, this, this.document);