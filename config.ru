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