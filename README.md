#### I've gone back to using PHP for my personal site, and my CentOS instance will be repurposed for other tinkering. See my site here: [matthew-brown.net][me2].

##### Original Readme:
# Personal Webserver for [matthew-e-brown.com][me]

This server hosts my mostly static website.

This Node.js webserver is running on an [Amazon Lightsail][lightsail] instance, running CentOS 7. It uses [NGINX][nginx] and [Passenger][passenger], alongside [Node.js][node] and [Express][express]. The dynamic parts of the website are rendered using [EJS][ejs].

---

I wouldn't be able to use Node.js and Express for my website if it wasn't for a few key players:
- [Daniel Shiffman][1], specifically [this YouTube tutorial][2] of his;
- [This tutorial][3] from Phusion Passenger themselves;
- And, funny enough, [this other repository][4] for a University that I found while browsing GitHub, which taught me the *proper* way to organize an Express site.

[me]: http://www.matthew-e-brown.com
[me2]: https://www.matthew-brown.net
[lightsail]: https://aws.amazon.com/lightsail/
[nginx]: https://nginx.org/en/
[passenger]: https://www.phusionpassenger.com/
[node]: https://nodejs.org/en/
[express]: https://expressjs.com/
[ejs]: https://ejs.co/

[1]: https://github.com/shiffman
[2]: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Yyn-fBtGHfN0_xCtBwUkBp
[3]: https://www.phusionpassenger.com/library/walkthroughs/deploy/nodejs/
[4]: https://github.com/2406-ta-team/comp2406-git-tutorial-base-code-FORK-ME
