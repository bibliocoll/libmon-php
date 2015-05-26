# Library Monitor - PHP Version

Building requires [ImageMagick] and [npm] to be installed on your system.

You should be able to get those quickly with either
`sudo apt-get install imagemagick npm` or `sudo pacman -S imagemagick npm` on linux,
or `brew install imagemagick node` on OS X, provided you have [Homebrew] installed,
or with `choco install imagemagick nodejs.install` on Windows with [chocolatey].

```
Note that version conflicts between scripting engines and libraries can get hairy
if multiple projects require different versions of the same.
If you know that to be a likely problem on your machine with NodeJS, there exists
a version management tool named [nvm] you might want to take a look at.
```

[ImageMagick]: http://www.imagemagick.org/script/index.php
[npm]: https://www.npmjs.com/
[Homebrew]: http://brew.sh/
[chocolatey]: https://chocolatey.org/
[nvm]: https://github.com/creationix/nvm
