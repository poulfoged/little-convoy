







function setup(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
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
                    version: "1.0.0"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-nuget');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ["clean:build", "typescript", "requirejs", "copy:client", "nugetpack", "clean:temp"]);
}

(module).exports = setup;
