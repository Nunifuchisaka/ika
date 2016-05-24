;(function($, window, document, undefined){
'use strict';

window.IKA = {};


$(function() {
  
  $('.js-gnav-toggle').click(function() {
    $(this).toggleClass('is-active');
    $('#gnav').toggleClass('is-close');
    return false;
  });
  
  new Modal1_View({
    el: '#top',
    group: 'js-modal-1'
  });
  
});



/*
## Modal1
*/

var Modal1_View = Backbone.View.extend({
  initialize: function(option) {
    _.bindAll(this, 'init', 'open', 'close');
    this.option = _.extend({
      group: 'js-modal-1'
    }, option);
    
    //DOM
    this.$window = $(window);
    this.$document = $(document);
    this.$modal = $('#modal-1');
    this.$wrapper = $('#modal-1__wrapper');
    this.$overlay = $('#modal-1__overlay');
    this.$contents = $('#modal-1__contents');
    this.$close = $('#modal-1__clone');
    
    //Event
    $('body').on('click', '.'+ this.option.group +'__trigger', this.open);
    this.$overlay.click(this.close);
    this.$wrapper.click(this.close);
    this.$contents.click(function(){return false});
    this.$close.click(this.close);
    
    //Template
    this.template = _.template( $('#modal-1-template').html() );
  },
  init: function() {
    
  },
  open: function(e) {
    var $target = $(e.currentTarget),
        bukiIndex = Number( $target.attr('data-buki-index') ),
        html = this.template(ca.weapons[bukiIndex]);
    
    this.$contents.html(html);
    
    this.$overlay.css({
      display: 'block',
      height: this.$document.height()
    });
    this.$wrapper.css({
      display: 'block',
      top: this.$document.scrollTop() + 80
    });
    
    return false;
  },
  close: function() {
    this.$overlay.css('display','none');
    this.$wrapper.css('display','none');
    return this;
  }
});




})(jQuery, this, this.document);