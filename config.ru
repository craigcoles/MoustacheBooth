use Rack::Static, 
  :urls => ["/js", "/moustaches", "/css", "/img"],
  :root => "public"

run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html' 
    },
    File.open('public/index.html', File::RDONLY)
  ]
}

# SASS
require 'sass/plugin/rack'
use Sass::Plugin::Rack


# Sprockets
require 'sprockets'
project_root = File.expand_path(File.dirname(__FILE__))
assets = Sprockets::Environment.new(project_root) do |env|
  env.logger = Logger.new(STDOUT)
end

assets.append_path(File.join(project_root, 'app', 'assets'))
assets.append_path(File.join(project_root, 'app', 'assets', 'javascripts'))
assets.append_path(File.join(project_root, 'app', 'assets', 'stylesheets'))
assets.append_path(File.join(project_root, 'app', 'assets', 'images'))

map "/assets" do
  run assets
end

map "/" do
  run lambda { |env|
    [
      200, 
      {
        'Content-Type'  => 'text/html', 
        'Cache-Control' => 'public, max-age=86400' 
      },
      File.open('public/index.html', File::RDONLY)
    ]
  }
end