use Rack::Static, 
  :urls => ["/js", "/moustaches"],
  :root => "public"

run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html' 
    },
    File.open('public/face.html', File::RDONLY)
  ]
}