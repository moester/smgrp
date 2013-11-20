class Viddler < Liquid::Tag
  Syntax = /^\s*([^\s]+)(\s+(\d+)\s+(\d+)\s*)?/
 
  def initialize(tagName, markup, tokens)
    super
 
    if markup =~ Syntax then
      @id = $1
      @secret = $2
 
      if $3.nil? then
          @width = 560
          @height = 420
      else
          @width = $3.to_i
          @height = $4.to_i
      end
    else
      raise "No Viddler ID provided in the \"viddler\" tag"
    end
  end
 
  def render(context)
    # "<iframe width=\"#{@width}\" height=\"#{@height}\" src=\"http://www.youtube.com/embed/#{@id}\" frameborder=\"0\"allowfullscreen></iframe>"
    # "<p>@id</p>"
    "<p>#{@id}</p>"
    # "<iframe id=\"viddler-#{@id}\" width=\"#{@width}\" height=\"#{@height}\" src=\"//www.viddler.com/embed/#{@id}/?f=1&offset=0&autoplay=0&secret=#{@secret}&disablebranding=0&view_secret=#{@secret}\" frameborder=\"0\" mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\"> </iframe>"
  end
 
  Liquid::Template.register_tag "viddler", self
end