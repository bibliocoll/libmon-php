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
            copy: {
                expand: true,
                cwd: 'app/',
                src: ['index.html', '**/index.html','images/*','alephAPI/*', 'styles/fonts'],
                dest: 'dist/',
            }
        },
        image_resize: {
            resize: {
                options: {
                    width: 150,
                    //concurrency: 4,
                    upscale: false
                },
                src: 'app/images/cover/*.{png,jpg,gif}',
                dest: '.tmp/images/cover/'
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
        'newer:image_resize:resize',
        'newer:imagemin:minify',
        'wiredep',
        'clean',
        'copy',
        'sass',
        'useminPrepare',
        'concat:generated',
        'uglify:generated',
        'cssmin:generated',
        'filerev',
        'usemin'
        //'htmlmin'
    ]);
};
