// Type definitions for Grunt JS
// Project: http://gruntjs.com/
// Definitions by: Basarat Ali Syed <https://github.com/basarat>
// Definitions: https://github.com/borisyankov/DefinitelyTyped








function setup(grunt) {
    var pkg = grunt.file.readJSON("package.json");

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,
        //copy: {
        //    bootstrap: {
        //        //expand: true,
        //        //flatten: true,
        //        src: ['./node_modules/almond/almond.js'],
        //        dest: './',
        //        filter: 'isFile'
        //    }
        //},
        clean: {
            build: {
                src: ['build\**', 'temp']
            },
            temp: {
                src: ['temp']
            }
        },
        typescript: {
            base: {
                src: ['*.ts', 'LittleConvoy.Js/**/*.ts'],
                options: {
                    'module': 'amd',
                    target: 'es5',
                    base_path: '',
                    sourcemap: false,
                    declaration: false
                }
            },
            definition: {
                src: ['LittleConvoy.Js/**/*.ts'],
                dest: 'temp',
                options: {
                    target: 'es5',
                    base_path: '',
                    sourcemap: false,
                    declaration: true
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: './LittleConvoy.Js',
                    name: '../node_modules/almond/almond',
                    out: "build/littleConvoy.js",
                    almond: true,
                    include: ['LittleConvoy.Client', 'LittleConvoy.Transports.HiddenFrame']
                }
            }
        },
        copy: {
            client: {
                src: ['Temp/LittleConvoy.Js/LittleConvoy.Interfaces.d.ts', 'Temp/LittleConvoy.Js/lib/PromiseAPI.d.ts'],
                dest: 'build/typings/',
                filter: 'isFile',
                flatten: true,
                expand: true
            }
        },
        //processhtml: {
        //    dist: {
        //        files: {
        //            'build/demo.html': ['LittleConvoy.Js/demo.html']
        //        }
        //    }
        //},
        nugetpack: {
            dist: {
                src: 'Package.nuspec',
                dest: 'build',
                options: {
                    version: pkg.version
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-nuget');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('default', ["clean:build", "typescript", "requirejs", "copy:client", "nugetpack", "clean:temp"]);
}

(module).exports = setup;
