







function setup(grunt) {
    var pkg = grunt.file.readJSON("package.json");

    grunt.initConfig({
        pkg: pkg,
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
        nugetpack: {
            dist: {
                src: 'Package.nuspec',
                dest: 'build',
                options: {
                    version: pkg.version
                }
            }
        },
        nugetpush: {
            dist: {
                src: 'build/*.nupkg'
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

    grunt.registerTask('dist', ["clean:build", "typescript", "requirejs", "copy:client", "nugetpack", "clean:temp", "nugetpush"]);
}

(module).exports = setup;
