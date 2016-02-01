;(function($, window, document, undefined){
'use strict';

var socket = io();

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
    console.log('changeName');
    var name = this.get('name'),
        buki = this.get('buki');
    if( null === buki ) {
      this.shuffleWeapon();
    }
  },
  changeBuki: function() {
    console.log('changeBuki');
    var buki = this.get('buki');
    if(null != buki) {
      this.set('buki_jp', ca.weapons[buki].name);
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
## View
*/

var View = Backbone.View.extend({
  
  el: '#view',
  
  events: {
    'change .js-input': 'changePlayerData'
  },
  
  initialize: function() {
    _.bindAll(this, 'render', 'sync', 'shuffle', 'receiveData', 'changePlayerData', 'save');
    
    this.template = {
      view: _.template( $('#view-template').html() ),
      weaponsItem: _.template( $('#weapons-item-template').html() )
    }
    
    this.attrs = new ViewModel();
    this.players = new PlayerList();
    
    this.attrs.on('change', this.render);
    this.attrs.on('change', this.sync);
    
    $('#shuffle').click(this.shuffle);
    
    this.load();
    
    var html = this.players.map(_.bind(function(player) {
      return this.template.weaponsItem( player.attributes );
    }, this)).join('');
    this.attrs.set('weaponsItemHTML', html);
    
    this.players.on('change', _.bind(function() {
      var html = this.players.map(_.bind(function(model, index) {
        return this.template.weaponsItem( model.toJSON() );
      }, this)).join('');
      this.attrs.set('weaponsItemHTML', html);
    }, this));
    //this.players.on('change', this.sync);
    this.players.on('change', this.save);
    
    socket.on('receive_data', this.receiveData);
  },
  
  shuffle: function() {
    this.players.shuffleWeapon();
  },
  
  load: function() {
    var players = $.cookie('players');
    if( players ) {
      players = JSON.parse(players);
      console.log('load', players);
      this.players.set(players);
    } else {
      for(var i = 0; i < player_num; i++) {
        this.players.add({index: i});
      }
    }
  },
  
  save: function() {
    var players = this.players.toJSON();
    players = JSON.stringify(players);
    $.cookie('players', players, {expires: 365, path: '/'});
  },
  
  receiveData: function(data) {
    data = JSON.parse(data);
    //console.log('receive_data', data, typeof data);
    this.attrs.set(data, {silent: true});
    this.render();
    notice('シャッフルしたでし！');
  },
  
  render: function() {
    console.log('render');
    var html = this.template.view( this.attrs.attributes );
    this.$el.html(html);
    return this;
  },
  
  sync: function() {
    var data = JSON.stringify( this.attrs.attributes );
    socket.emit('send_data', data);
  },
  
  changePlayerData: function(e) {
    var $input = $(e.target),
        val = $input.val(),
        item = $input.attr('name'),
        player = Number( $input.attr('data-player') );
    this.players.at(player).set(item, val);
  }
  
});



/*
## app
*/

$(function() {
  
  new View();
  
});


})(jQuery, this, this.document);