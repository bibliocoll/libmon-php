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
                    'app/styles/main.scss',  // .scss & .sass support...
                    'app/styles/main.sass'  // .scss & .sass support...
                ],
            }
        },
        copy: {
            copy: {
            expand: true,
            cwd: 'app/',
            src: ['index.html', '**/index.html','images/*'],
            dest: 'dist/',
            }
        },
        image_resize: {
            resize: {
                options: {
                    width: 150,
                    concurrency: 4,
                    overwrite: true,
                    upscale: false
                },
                src: 'app/images/cover/*',
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

    //grunt.loadNpmTasks('grunt-wiredep');
    //grunt.loadNpmTasks('grunt-usemin');
    //grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.loadNpmTasks('grunt-filerev');
    //grunt.loadNpmTasks('grunt-imagemin');
    //grunt.loadNpmTasks('grunt-image-resize');

    grunt.registerTask('default', [
        'newer:image_resize:resize',
        'newer:imagemin:minify',
        'wiredep',
        'copy',
        'useminPrepare',
        'concat:generated',
        'uglify:generated',
        'cssmin:generated',
        'filerev',
        'usemin',
        'htmlmin'
    ]);
};
