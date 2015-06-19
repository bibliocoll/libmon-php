# Library Monitor - PHP Version
A responsive website showcasing the newest additions to an Aleph-based library.

This release is aimed at (computer-savvy) system librarians.
Please note that we plan to rework this into a static html generator sometime
in the coming month(s), so the below-mentioned server-side PHP requirements
will go away. The Aleph requirements obviously will not.

##Prerequisites
To run this website for yourself, you need access to an [Aleph X-Server] and
a webserver with PHP 5.3+, PEAR and [PEAR::Cache_Lite]. Your Aleph installation
needs to have (local) information fields set up to support finding works by
month of acquisition, and to separate them by type.

The Demo does not query Aleph, and only requires a correctly configured
webserver.

This source code release may be frustrating to work with on a Windows machine
and is likely unusable on one where you do not have Administrator privileges.
We recommend a Linux VM in this case. We also assume you are familiar with
the command prompt on your operating system of choice.

##Getting the Source
Use `git clone https://github.com/bibliocoll/libmon-php.git`, or use the
'Download ZIP' link on the right. If you end up doing more with this than
playing with the demo, please create a fork. We would love to see what you
create.

##Checking out the Demo
The demo is found in an archive named 'demo.zip' and, when extracted, creates
a directory structure with an un-minified version of what you would get out of
running the build process.

```
demo/
├── alephAPI/
│   └── getlatest.php <- this one needs editing
├── images
│  └── cover/
│       └── (publication cover images need to go here)
├── [newbooks/, new-e-books/, newpublications/]
│   └── one index.html each
├── scripts/
│   └── getcontents.js and lots of javascript libraries
└── styles/
    └── local.css and lots of css libraries
    └── fonts/
```

Instead of interfacing with Aleph, the demo by default serves CC0-licensed
stock photos and some example text that comes bundled with it.
If you copy the demo folder to your webserver, you should be able to get a
feeling for the interface with the included sample data (provided the above
mentioned PHP requirements are satisfied).

##Build Process
The Library Monitor website is made with a lot of third party code that
is not included in this repository. However, we have attempted to automate
the process of downloading the missing pieces ~~using a humongous, stinking
pile of hipster brogrammer bloatware BS that will eat your productivity alive~~
utilizing the latest in frontend development toolchain magic to give you
a running start. We hope you enjoy using this as much as we did making it.

Building requires [ImageMagick] and a recent version of [npm] to be installed
on your system.

```
Note regarding npm:
version conflicts between scripting engines and libraries can get hairy,
if multiple projects require different versions of the same.
```
If you know that to be a likely problem on your machine with NodeJS, there exists
a version management tool named [nvm] you might want to read up on.

You should be able to get the requirements quickly with either
`sudo apt-get install imagemagick npm` or `sudo pacman -S imagemagick npm` on
linux, or `brew install imagemagick node` on OS X, provided you have
[Homebrew] installed, or with `choco install imagemagick nodejs.install` on
Windows with [chocolatey].

Verify with `node --version` that you have a working installation of version
0.10 or higher, and a `npm --version` of at least 2.10.
If your package manager does not supply a recent version, uninstall and
[install manually].

###Using those goddamn hipster build tools
Once that is set up, navigate your console to the `libmon-php` folder and grab
all the requirements with `npm install`. This will start a lengthy process with
lots of output and a few warning messages about failed optional dependencies.
If that completes without actual errors, you will now have [Bower] and [Grunt]
installed in this directory, which enables you to download all the javascript
and css library dependencies from github in the correct respective versions
with `bower install`. That will create some output roughly similar to what npm
spat out, and will hopefully provision you with all the required nuts and bolts
to successfully run `grunt` and build a minified version from source.
####In short: `npm install && bower install && grunt`

This will create directories as follows
```
libmon-php
├── [4.9M]  bower_components/
├── [ 72M]  node_modules/
├── [ ~1M]  .tmp/
└── [ ~1M]  dist/
```
where 'node_modules' contains one meter of shelved books worth of mostly
redundant javascript, 'bower_components' contains the git repositories of
all the web framework code this project uses and the remaining two
not-ridiculously-large directories contain working files and the minified
version of what was in 'app' before `grunt` was run.
If you change anything in the 'app' folder, running `grunt` again will see
your changes reflected in 'dist'.

##Hacking on it
```
Note: You should read the Gruntfile.js section below before adding html files.
```
TODO: create a `grunt dev` task to build an unminified/sourcemapped version

###High concept, flow of control & data
Upon page load, the Javascript part (app/scripts/getcontents.js) triggers an
AJAX call to the PHP script (app/alephAPI/getlatest.php), which in return
queries Aleph with certain predefined query fields. The interesting parts of
Aleph's Marc OAI XML response are converted to JSON and returned to the
Javascript via callback. A jQuery.each() loop is then used to fill carousel
slides with the returned data.

The PHP script utilizes [PEAR::Cache_Lite] to quickly serve cached JSON
results.

###Backend: app/alephAPI/getlatest.php and Aleph X-Server
This script needs to run on a machine that is allowed to send http requests
to your Aleph X-Server. Note that you can in principle put this script on a
secondary machine that is not your main web server and use this setup to relay
public requests to an Aleph installation that is not accessible from the
Internet. The script also hides the Aleph X-URL and query details from the
public ...unless published on github ;)

The code is heavily commented, but you will need an understanding of the
OAI Marc specification and the XPath query language to make meaningful
changes here. It is possible that you may have to change a few thing around
on the Aleph side to get useful results.

The return value is in JSONP format and looks somewhat like this:
```javascript
name_of_callback([{"rather":"long"},{"array":"of","JSON":"objects"}])
```

###Plumbing: app/scripts/getcontents.js
This script contains one function, getcontents(), which is called upon the
$(document).ready() jQuery event. getcontents() will issue an [jQuery.ajax()]
call and once it is .done(), use the returned data in an [.each()]-loop
to [.clone()] certain parts of the html file and fill them with what was
returned. The parts thus replicated happen to be slides in a [slick] carousel.

###Visuals: app/styles/local.sass
Historically, libmon-php's layout was created with a .css file, and this is just
a reverse-converted version of that. So we currently aren't using any of the
useful SASS features, but we hope you at least like the syntax better.

###Frameworks: Shoulders of giants
libmon-php is made with the Zurb [Foundation] framework, which is built upon
[jQuery], the carousel/slider is called [slick].

###Build Pipeline: Gruntfile.js
This setup is a bit of an experiment and is likely to change again.
The goal is to allow for (more recent) versions of the framework and its
dependencies to be transparently updatable/installable. To this end,
we're using [grunt-wiredep] and [grunt-usemin] together. In a nutshell,
'wiredep' turns entries in the 'bower.json' config file into stylesheet- and
javascript-links in an html file. 'usemin' creates a pipeline for SASS-
compilation, concatenation, minification, and file versioning. Please refer to
the respective docs for details.
When changing things, please note that only 'app/index.html' is using the
wiredep/usemin setup, while the other html files all reference the resulting
minified version. This is not ideal, but mandated by shortcomings in 'usemin'.

Image files in 'app/images/cover' are automatically resized and optimized
for file size. This part of the grunt workflow can fail with a 'spawn EMFILE'
error, meaning that more file handles have been opened than your OS allows per
user. You should be able to raise that limit with `ulimit -S -n 4096`, which is
safe to do on desktop systems.

[Aleph X-Server]: https://developers.exlibrisgroup.com/aleph/apis/Aleph-X-Services/introduction-to-aleph-x-services
[PEAR::Cache_Lite]: https://pear.php.net/manual/en/package.caching.cache-lite.intro.php
[ImageMagick]: http://www.imagemagick.org/script/index.php
[npm]: https://www.npmjs.com/
[Homebrew]: http://brew.sh/
[chocolatey]: https://chocolatey.org/
[nvm]: https://github.com/creationix/nvm
[install manually]: https://nodejs.org/download/
[Bower]: http://bower.io
[Grunt]: http://gruntjs.com
[grunt-wiredep]: https://github.com/stephenplusplus/grunt-wiredep
[grunt-usemin]: https://github.com/yeoman/grunt-usemin
[Foundation]: http://foundation.zurb.com/
[jQuery]: https://jquery.com
[jQuery.ajax()]: https://api.jquery.com/jQuery.ajax/
[.each()]: https://api.jquery.com/each/
[.clone()]: https://api.jquery.com/clone/
[slick]: https://kenwheeler.github.io/slick/
