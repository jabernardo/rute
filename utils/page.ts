export function defaultPage(title: string, message: string) {
  const favicon = "https://raw.githubusercontent.com/jabernardo/rute/master/assets/favicon.ico";

  return `
<!doctype html>
<head>
  <title>${title}</title>
  <meta charSet="UTF-8" />
  <link rel="icon" type="image/png" href="${favicon}"/>
  <link rel="shortcut icon" type="image/png" href="${favicon}"/>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
  <style type="text/css">
    body {
      background: #f0f0f0;
    }

    .container {
      font-family: 'Courier New', 'Courier';
      font-size: 24px;
      margin: 4rem auto;
      max-width: 1024px;
      color: #353535;
    }

    .container::before {
      content: "";
      background: url('https://raw.githubusercontent.com/jabernardo/rute/master/assets/rute.png') no-repeat center top;
      opacity: 0.2;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      z-index: -1;
    }

    .container h1 {
      color: #378f00;
    }
  </style>
</body>
    `;
}