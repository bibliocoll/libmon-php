module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        wiredep: {
            task: {
                src: [
                    'app/**/*.html',   // .html support...
                    //'app/views/**/*.jade',   // .jade support...
                    //'app/config.yml',         // and .yml & .yaml support out of the box!
                    'app/styles/*.scss',  // .scss & .sass support...
                    'app/styles/*.sass'  // .scss & .sass support...
                ],
            }
        },
        clean: ['.tmp/concat', 'dist/styles', 'dist/scripts'],
        copy: {
            app: {
                expand: true,
                cwd: 'app/',
                src: ['index.html', '**/index.html','images/*','alephAPI/*', 'styles/fonts/*'],
                dest: 'dist/',
            },
            slick_fonts: {
                expand: true,
                cwd: 'bower_components/slick-carousel/slick/fonts/',
                src: ['*.{woff,tff,svg,eot}'],
                dest: 'dist/styles/fonts/',
            },
            slick_ajax_loader: {
                expand: true,
                cwd: 'bower_components/slick-carousel/slick/',
                src: ['ajax-loader.gif'],
                dest: 'dist/styles/',
            },
            foundation_icon_fonts: {
                expand: true,
                cwd: 'bower_components/foundation-icon-fonts/',
                src: ['*.{woff,tff,svg,eot}'],
                dest: 'dist/styles/',
            }
        },
        "imagemagick-resize":{
            resize:{
                from:'app/images/cover/',
                to:'.tmp/images/cover/',
                files:'*',
                props:{
                    width: 187,
                    quality: 0.95,
                    //filter: 'Mitchell',
                    sharpening: 0.1
                }
            }
        },
        imagemin: {
            minify: {
                files: [{
                    expand: true,
                    cwd: '.tmp/images/cover/',
                    src: ['*.{png,jpg,gif}'],
                    dest: 'dist/images/cover/'
                }]
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            convert: {
                files: [{
                    expand: true,
                    cwd: 'app/styles',
                    src: ['*.sass'],
                    dest: 'app/styles',
                    ext: '.css'
                }]
            }
        },
        useminPrepare: {
            html: [
                'app/index.html',
                'app/newbooks/index.html',
                'app/new-e-books/index.html',
                'app/newpublications/index.html'
            ],
            options: {
                sourceMap: true,
                dest: 'dist'
            }
        },
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            source: {
                files: [{
                    src: [
                        'dist/scripts/*.js',
                        'dist/styles/*.css'
                    ]
                }]
            }
        },
        usemin: {
            html: [
                'dist/index.html',
                'dist/newbooks/index.html',
                'dist/new-e-books/index.html',
                'dist/newpublications/index.html'
            ],
            options: {
                assetsDirs: ['dist', 'dist/styles', 'dist/scripts']
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist/index.html',
                    'dist/newbooks/index.html': 'dist/newbooks/index.html',
                    'dist/new-e-books/index.html': 'dist/new-e-books/index.html',
                    'dist/newpublications/index.html': 'dist/newpublications/index.html'
                }
            }
        }
    });

    grunt.registerTask('default', [
        'imagemagick-resize',
        'imagemin:minify',
        'wiredep',
        'clean',
        'copy',
        'newer:sass',
        'useminPrepare',
        'concat:generated',
        'uglify:generated',
        'cssmin:generated',
        'filerev',
        'usemin',
        'htmlmin'
    ]);
};
