all: make_certs run

make_certs:
	mkcert -key-file "./ssl/key.pem" -cert-file "./ssl/cert.pem" "localhost"

run:
	deno run --allow-net --allow-read app.ts