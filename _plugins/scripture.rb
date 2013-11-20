require 'net/http'

class ESV
  def initialize(key)
    @options = ["include-short-copyright=0",
                "output-format=crossway-xml-1.0",
                "include-passage-horizontal-lines=0",
                "include-heading-horizontal-lines=0"].join("&")
    @base_url = "http://www.esvapi.org/v2/rest/passageQuery?key=#{key}"
  end

  def doPassageQuery(passage)
    passage = passage.gsub(/\s/, "+")
    passage = passage.gsub(/\:/, "%3A")
    passage = passage.gsub(/\,/, "%2C")
    get_url @base_url +
             # "&passage=#{passage}&#{@options}"
             "&passage=#{passage}"
  end
  
  private
  def get_url(url)
    Net::HTTP.get(::URI.parse(url))
  end
end

module Jekyll
  module Filters
    def scripture(passage)      

      # bible = ESV.new(ARGV[0] || 'IP')
      bible = ESV.new('IP')
      bible.doPassageQuery( passage.to_s )

    end
  end
end

Liquid::Template.register_filter(Jekyll::Filters)