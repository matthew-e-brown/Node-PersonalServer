# Personal Webserver for [matthew-e-brown.com](http://www.matthew-e-brown.com)

This server hosts my mostly static website. The website is in the `.gitignore`'d folder, '`public`'. It can be viewed [on its own repository](https://github.com/matthew-e-brown/Personal-Site).

This Node.js webserver is running on an [Amazon Lightsail](https://aws.amazon.com/lightsail/) instance, running CentOS 7. It uses [NGINX](https://nginx.org/en/), [Phusion Passenger](https://www.phusionpassenger.com/), [Node.js](https://github.com/nodejs/node), and [Express](https://expressjs.com/). This repository holds the Node.js and Express portion.

Thanks to both [Daniel Shiffman](https://github.com/shiffman)'s [YouTube tutorial](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Yyn-fBtGHfN0_xCtBwUkBp) for teaching me the basics of Node and Express, and to [this tutorial](https://www.phusionpassenger.com/library/walkthroughs/deploy/nodejs/) on Phusion Passenger's site for helping me deploy my Node.js 'webapp' to a server -- even if said webapp was just a personal website.
