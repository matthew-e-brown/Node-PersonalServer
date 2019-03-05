function getCookies() {
  const browserCookie = document.cookie;
  // const allCookies = browserCookie.split(';');
  let cookies = {};
  for (const cookie of browserCookie.split(';')) {
    let c = cookie.split('=');
    cookies[c[0].replace(/^ /, '')] = c[1];
  }

  return cookies;
}

getCookie = name => getCookies()[name];
//To get an individual cookie

doesCookieExist = name => getCookie(name) ? true : false;
//Just in case you need a true or false, not truthy or falsey

function setCookie(name, value) {
  document.cookie = `${name}=${value};`;
}
