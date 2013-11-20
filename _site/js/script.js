/* Modles and Collections
***************************/
var Attendee = Backbone.Model.extend({

    toggle: function() {
        var _this = this,
            coming = (+this.get('coming') === 0 || +this.get('coming') == 1) ? 2 : 1;

        this.set('coming', coming);

        $.ajax({
            type: "Post",
            url: "http://api.samselikoff.com/smallgroup/attendees/"+_this.id,
            data: {coming: _this.get('coming')}
        });
    }

});

var Attendees = Backbone.Collection.extend({

    model: Attendee,

    url: "http://api.samselikoff.com/smallgroup/attendees",

    comparator: function(attendee) {
      return attendee.get("family");
    },

    resetAll: function() {
        var _this = this,
            posting = $.get( "http://api.samselikoff.com/smallgroup/attendees/reset" );

        posting.done(function() {
            var model;

            while (model = _this.first()) {
                model.destroy();
            }

            _this.fetch({reset: true});
        });
    }
});

var smallgroup = new Attendees;



/* Views
***************************/
var AttendeeView = Backbone.View.extend({

    events: {
        'click button': 'toggle',
    },

    model: Attendee,

    tagName: "div",

    className: "span3",

    initialize: function() {
        this.template = _.template($('#attendee-template').html()),

        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        this.$el.html(this.template( this.model.toJSON()));
        // this.$el.toggleClass('coming', this.model.get('coming'));
        // this.input = this.$('.edit');
        return this;
    },

    toggle: function() {
        this.model.toggle();
    },

});

/* App
***************************/
var AppView = Backbone.View.extend({

    events: {
        'click .reset': 'resetAll'
    },

    initialize: function() {
        // this.$el.append( '<a href="#" class="btn reset">Reset</a>')

        this.listenTo(smallgroup, 'reset', this.addAll);
        this.listenTo(smallgroup, 'all', this.render);

        smallgroup.fetch({reset: true});
    },

    render: function() {
        $('#attendee-count').text( smallgroup.where({coming: 2}).length );
    },

    addAll: function() {
        var _this = this;
        // smallgroup.each(this.addOne, this);

        var families = _.union( smallgroup.pluck('family') ),
            familyTemplate = _.template($('#family-template').html());

        _.each( families, function(family) {
            _this.$el.append( familyTemplate({id: family.replace(" ", "_"), family: family}) );

            _(smallgroup.where({family: family})).each(function(attendee, i) {
                attendee.set('coming', +attendee.get('coming')); // coerce coming into an integer
                var view = new AttendeeView({model: attendee});
                if (i % 4 === 0) {
                    _this.$(".family-list." + attendee.get('family').replace(" ", "_")).append('<div class="row">')
                }
                _this.$(".family-list." + attendee.get('family').replace(" ", "_") + ' .row').last().append(view.render().el);
                // _this.$('.row').last().append(view.render().el);
            })

        })

    },

    resetAll: function(e) {
        e.preventDefault();
        smallgroup.resetAll();
    }

})




/* Utility
***************************/
function adjustIframes()
{
  $('iframe').each(function(){
    var
    $this       = $(this),
    proportion  = $this.data( 'proportion' ),
    w           = $this.attr('width'),
    actual_w    = $this.width();
    
    if ( ! proportion )
    {
        proportion = $this.attr('height') / w;
        $this.data( 'proportion', proportion );
    }
  
    if ( actual_w != w )
    {
        $this.css( 'height', Math.round( actual_w * proportion ) + 'px' );
    }
  });
}




$(function() {

    $('a[data-toggle="collapse"]').click(function(e) {e.preventDefault();});

    var app = new AppView({ el: '#attendees' });

    $(window).on('resize load',adjustIframes);

});