//@module bb1.PetshopShopping.GoogleTagManager
define(
  'bb1.PetshopShopping.GoogleTagManager',
  [
    'GoogleTagManager',
    'SC.Configuration',

    'Backbone',
    'underscore'
  ],
  function (
    GoogleTagManager,
    Configuration,

    Backbone,
    _
  ) {
    'use strict';

    _.extend(GoogleTagManager, {

      pushData: function (data) {

        console.log('asdssd');
        var win = window,
          data_layer = win[this.configuration.dataLayerName],
          self = this;

        console.log(data_layer);
        if (!data_layer) return;

        this.win = win;

        this.debouncedData = this.debouncedData || [];

        data_layer.push(data);
        this.debouncedData.push(data);

        if (!this.data_layer_loaded) {
          this.loadDataLayerRecord(win);
        } else {
          if (!this.saveEvent) {
            this.saveEvent = _.debounce(_.bind(function () {
              this.model.saveEvent(this.debouncedData);
              this.debouncedData = null;
            }, this), 200);
          }
          this.saveEvent();
        }
      },

      loadDataLayerRecord: function (win) {
        if (!this.data_layer_loading && !this.data_layer_loaded) {
          var self = this
            , gaAll = win.ga && win.ga.getAll && win.ga.getAll()
            , gid = gaAll && gaAll.length && gaAll[0].get('_gid');

          this.data_layer_loading = true;

          //IMPORTANT UPDATE

          // if (!gid && jQuery.cookie('_gid')) {
          //   gid = jQuery.cookie('_gid').split('.').slice(2, 4).join('.');
          // }

          if (gid) {
            this.model.getDataLayer({
              id: gid
              , events: win[this.configuration.dataLayerName]
            }).done(function () {
              self.data_layer_loaded = true;
            });
          } else {
            this.data_layer_loading = false;
          }
        }
      }

    });

  }
);
