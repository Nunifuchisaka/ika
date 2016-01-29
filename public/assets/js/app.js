;(function($, window, document, undefined){
'use strict';

var socket = io();

var categorys_jp = ['シューター', 'ブラスター', 'ローラー', '筆', 'チャージャー', 'スロッシャー', 'スピナー']

var weapons = [
  {
    name: 'わかばシューター',
    category: 0
  }, {
    name: 'もみじシューター',
    category: 0
  }, {
    name: 'スプラシューター',
    category: 0
  }, {
    name: 'スプラシューターコラボ',
    category: 0
  }, {
    name: '.52ガロン',
    category: 0
  }, {
    name: 'N-ZAP85',
    category: 0
  }, {
    name: 'シャープマーカー',
    category: 0
  }, {
    name: 'プロモデラーMG',
    category: 0
  }, {
    name: 'N-ZAP89',
    category: 0
  }, {
    name: 'ジェットスイーパー',
    category: 0
  }, {
    name: 'L3リールガン',
    category: 0
  }, {
    name: 'シャープマーカーネオ',
    category: 0
  }, {
    name: 'ホットブラスター',
    category: 1
  }, {
    name: 'H3リールガン',
    category: 0
  }, {
    name: 'プライムシューター',
    category: 0
  }, {
    name: '.52ガロンデコ',
    category: 0
  }, {
    name: 'ノヴァブラスター',
    category: 0
  }, {
    name: '.96ガロン',
    category: 0
  }, {
    name: 'ボールドマーカー',
    category: 0
  }, {
    name: 'L3リールガンD',
    category: 0
  }, {
    name: 'プロモデラーRG',
    category: 0
  }, {
    name: '.96ガロンデコ',
    category: 0
  }, {
    name: 'H3リールガンD',
    category: 0
  }, {
    name: 'ラピッドブラスター',
    category: 1
  }, {
    name: 'ロングブラスター',
    category: 1
  }, {
    name: 'ジェットスイーパーカスタム',
    category: 0
  }, {
    name: 'ノヴァブラスターネオ',
    category: 0
  }, {
    name: 'Rブラスターエリート',
    category: 1
  }, {
    name: 'デュアルスイーパー',
    category: 0
  }, {
    name: 'ホットブラスターカスタム',
    category: 0
  }, {
    name: 'ロングブラスターカスタム',
    category: 0
  }, {
    name: 'デュアルスイーパーカスタム',
    category: 0
  }, {
    name: 'ボールドマーカーネオ',
    category: 0
  }, {
    name: 'ラピッドブラスターデコ',
    category: 1
  }, {
    name: 'Rブラスターエリートデコ',
    category: 0
  }, {
    name: 'プライムシューターコラボ',
    category: 0
  }, {
    name: 'スプラローラー',
    category: 2
  }, {
    name: 'スプラローラーコラボ',
    category: 2
  }, {
    name: 'パブロ',
    category: 3
  }, {
    name: 'カーボンローラー',
    category: 2
  }, {
    name: 'パブロ・ヒュー',
    category: 3
  }, {
    name: 'ホクサイ',
    category: 3
  }, {
    name: 'カーボンローラーデコ',
    category: 2
  }, {
    name: 'ダイナモローラー',
    category: 2
  }, {
    name: 'ホクサイ・ヒュー',
    category: 3
  }, {
    name: 'ダイナモローラーテスラ',
    category: 2
  }, {
    name: 'スプラチャージャー',
    category: 4
  }, {
    name: 'スプラチャージャーワカメ',
    category: 4
  }, {
    name: 'スクイックリンα',
    category: 4
  }, {
    name: 'スクイックリンβ',
    category: 4
  }, {
    name: 'スプラスコープ',
    category: 4
  }, {
    name: '14式竹筒銃・甲',
    category: 4
  }, {
    name: '14式竹筒銃・乙',
    category: 4
  }, {
    name: 'スプラスコープワカメ',
    category: 4
  }, {
    name: 'リッター3K',
    category: 4
  }, {
    name: '3Kスコープ',
    category: 4
  }, {
    name: 'リッター3Kカスタム',
    category: 4
  }, {
    name: '3Kスコープカスタム',
    category: 4
  }, {
    name: 'バケットスロッシャー',
    category: 5
  }, {
    name: 'ヒッセン',
    category: 5
  }, {
    name: 'バケットスロッシャーデコ',
    category: 5
  }, {
    name: 'スクリュースロッシャー',
    category: 5
  }, {
    name: 'ヒッセン・ヒュー',
    category: 5
  }, {
    name: 'スクリュースロッシャーネオ',
    category: 5
  }, {
    name: 'バレルスピナー',
    category: 6
  }, {
    name: 'スプラスピナー',
    category: 6
  }, {
    name: 'バレルスピナーデコ',
    category: 6
  }, {
    name: 'ハイドラント',
    category: 6
  }, {
    name: 'スプラスピナーコラボ',
    category: 6
  }, {
    name: 'ハイドラントカスタム',
    category: 6
  }
];


var player_num = 8;


var ViewModel = Backbone.Model.extend({
  defaults: function() {
    return {
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
      this.set('buki_jp', weapons[buki].name);
    }
  },
  shuffleWeapon: function() {
    var i = Math.floor( Math.random() * weapons.length );
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