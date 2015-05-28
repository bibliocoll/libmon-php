# Library Monitor - PHP Version
A responsive website showcasing the newest additions to an Aleph-based library.
This release is aimed at (computer-savvy) system librarians.

Note that we plan to rework this into a static html generator sometime in the
coming month(s), so the below-mentioned server-side PHP requirements will go
away. The Aleph requirements obviously will not.

##Prerequisites
To run this website for yourself, you need access to an Aleph "X"-Server and
a Webserver with PHP 5.3+, PEAR and PEAR::Cache_Lite. Your Aleph installation
needs to have (local) information fields set up to support finding works by
month of acquisition, and to separate them by type. If you want to try the
Demo, you will have to manually edit a PHP script so it knows about your Aleph
installation and suitable query parameters.

The source code release may be frustrating to work with on a Windows machine
and is likely unusable on one where you do not have Administrator privileges.
We recommend a Linux VM in this case. We also assume you can work with
the command prompt on your development box.

##Getting the Source
Use `git clone https://github.com/bibliocoll/libmon-php.git`, or use the
'Download ZIP' link on the right.

##Checking out the Demo
the demo is found in an archive named 'demo.zip' and, when extracted, creates
a directory structure with an un-minified version of what you would get out of
running the build process.


```
demo/
├── alephAPI/
│   └── getlatest.php <- this one needs editing
├── images
│  └── cover/
│       └── (lots of pictures need to go here)
├── [newbooks/, new-e-books/, newpublications/]
│   └── one index.html each
├── scripts/
│   └── getcontents.js and lots of javascript libraries
└── styles/
    └── local.css and lots of css libraries
    └── fonts/
```

TODO: actually add non-expiring demo cache files so there is some data to show

If you copy the demo folder to your webserver, you shoud be able to browse some
sample data (provided the above mentioned PHP requirements are satisfied).

##Build Process
Building requires [ImageMagick] and [npm] to be installed on your system.

```
Note regarding npm:
version conflicts between scripting engines and libraries can get hairy
if multiple projects require different versions of the same.
If you know that to be a likely problem on your machine with NodeJS, there exists
a version management tool named [nvm] you might want to read up on.
```

You should be able to get the requirements quickly with either
`sudo apt-get install imagemagick npm` or `sudo pacman -S imagemagick npm` on
linux, or `brew install imagemagick node` on OS X, provided you have
[Homebrew] installed, or with `choco install imagemagick nodejs.install` on
Windows with [chocolatey].

Verify with `node --version` that you have a working installation of version
0.10 or higher, and a `npm --version` of at least 2.10.
If your package manager does not supply a recent version, uninstall and
[install manually].

### those goddamn hipster build tools that no-one will still be using tomorrow
#### in short: `npm install && bower install && grunt`

Once that is all set up, navigate your console to the `libmon-php` folder and
grab all the requirements with `npm install`. This will start a lengthy process
with lots of output and a few warning messages about failed optional
dependencies. If that completes without actual errors, you will now have bower
and grunt installed in this directory, which allows you to download all the
javascript and css library dependencies from github in the correct respective
versions with `bower install`. This will create some output roughly similar to
what npm spat out, and will hopefully provision you with all the required bits
and pieces to successfully run `grunt` and build a minified version from
source.

You can find the result of a completed `grunt` run in a newly created folder
named 'dist'. If you change anything in the 'app' folder, running `grunt`
again will see your changes reflected in 'dist'.

The image optimization part of the grunt workflow can fail with a 'spawn EMFILE'
error, meaning that too many file handles have been opened. You should be able
to raise that limit with `ulimit -S -n 4096`.

##Hacking on it
###High concept, flow of control & data
Upon page load, the Javascript part (app/scripts/getcontents.js) triggers an
AJAX call to the PHP script (app/alephAPI/getlatest.php), which in return
queries Aleph with certain predefined query fields. The interesting parts of
Aleph's Marc OAI XML response are converted to JSON and returned to the
Javascript via callback. A jQuery.each() loop is then used to fill carousel
slides with the returned data.

The PHP script utilizes PEAR::Cache_Lite to quickly serve cached JSON results.

###Backend: app/alephAPI/getlatest.php
This script needs to run on a machine that can access your Aleph X-Server.
Note that you can use this to relay public requests to an Aleph installation
that is not accessible from the Internet. The script also hides the Aleph X-URL
and query details from the public ...unless published on github ;)

The code is heavily commented, but you will need an understanding of the
OAI Marc specification and the XPath query language to make meaningful
changes here. It is possible that you may have to change a few thing around
on the Aleph side to get useful results.

TODO: fill in the juicy bits below
###Plumbing: app/scripts/getcontents.js
###Visuals: app/styles/local.sass
###Build Pipeline: Gruntfile.js


[ImageMagick]: http://www.imagemagick.org/script/index.php
[npm]: https://www.npmjs.com/
[Homebrew]: http://brew.sh/
[chocolatey]: https://chocolatey.org/
[nvm]: https://github.com/creationix/nvm
[install manually]: https://nodejs.org/download/
